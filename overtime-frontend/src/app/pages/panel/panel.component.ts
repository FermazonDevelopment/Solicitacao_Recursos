import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { OvertimeRequestService } from '../../core/services/overtime-request.service';
import { ToastService } from '../../shared/toast/toast.service';
import { OvertimeRequest } from '../../core/models/overtime-request.model';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { environment } from '../../../environments/environment';

const RES_TAGS: Record<string, { icon: string; label: string; cls: string }> = {
  lanche: { icon: 'lunch_dining',    label: 'Lanche', cls: 'tag-yellow' },
  janta:  { icon: 'restaurant',      label: 'Janta',  cls: 'tag-green'  },
  rota:   { icon: 'directions_bus',  label: 'Rota',   cls: 'tag-blue'   },
  uber:   { icon: 'local_taxi',      label: 'Uber',   cls: 'tag-purple' },
  cafe:   { icon: 'local_cafe',      label: 'Café',   cls: 'tag-yellow' },
  almoco: { icon: 'restaurant_menu', label: 'Almoço', cls: 'tag-green'  },
};

const RES_CFG: Record<string, { icon: string; label: string; cls: string }> = {
  lanche: { icon: 'lunch_dining',    label: 'Lanche', cls: 'ri-lanche' },
  janta:  { icon: 'restaurant',      label: 'Janta',  cls: 'ri-janta'  },
  rota:   { icon: 'directions_bus',  label: 'Rota',   cls: 'ri-rota'   },
  uber:   { icon: 'local_taxi',      label: 'Uber',   cls: 'ri-uber'   },
  cafe:   { icon: 'local_cafe',      label: 'Café',   cls: 'ri-cafe'   },
  almoco: { icon: 'restaurant_menu', label: 'Almoço', cls: 'ri-almoco' },
};

const PERM_LABELS: Record<string, string> = {
  '19:30': 'Até 19:30', '21:00': 'Até 21:00', 'until12': 'Até 12h', 'after12': 'Após 12h'
};

export interface EditState {
  permanencia: string;
  motivo: string;
  veiculoProprio: boolean;
  resources: string[];
  loading: boolean;
}

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, DatePickerComponent],
  templateUrl: './panel.component.html'
})
export class PanelComponent implements OnInit, OnDestroy {
  auth    = inject(AuthService);
  reqSvc  = inject(OvertimeRequestService);
  private toast  = inject(ToastService);
  private http   = inject(HttpClient);

  requests: OvertimeRequest[] = [];
  fltDept = '';
  fltDate = new Date().toISOString().split('T')[0];
  fltStatus = '';
  departments: string[] = [];
  resTags = RES_TAGS;
  resCfg  = RES_CFG;
  resKeys = Object.keys(RES_CFG);
  permLabels = PERM_LABELS;

  // Edit modal
  editingId: string | null = null;
  editingRequest: OvertimeRequest | null = null;
  editState: EditState | null = null;

  // Confirm individual
  confirmingId: string | null = null;

  // Cancel confirm (pending → delete)
  cancelingId: string | null = null;

  // Cancel confirmed → CANCELADO
  cancelingConfirmedId: string | null = null;
  cancelReason = '';

  // Seleção múltipla
  selectedIds = new Set<string>();
  confirmingBulk = false;

  private timer?: ReturnType<typeof setInterval>;

  get isAdmin(): boolean { return this.auth.isAdmin(); }

  get kpis() {
    const all = this.requests;
    return [
      { icon: 'receipt_long',   label: 'Total',    val: all.length,                                                          color: 'var(--primary)' },
      { icon: 'schedule',       label: 'Pendentes', val: all.filter(r => r.status === 'PENDENTE').length,                   color: 'var(--yellow)'  },
      { icon: 'lunch_dining',   label: 'Lanches', val: all.filter(r => r.resources.includes('lanche')).length, color: 'var(--yellow)'  },
      { icon: 'restaurant',     label: 'Jantas',  val: all.filter(r => r.resources.includes('janta')).length,  color: 'var(--green)'   },
      { icon: 'directions_bus', label: 'Rotas',   val: all.filter(r => r.resources.includes('rota')).length,   color: 'var(--blue)'    },
      { icon: 'local_taxi',     label: 'Ubers',   val: all.filter(r => r.resources.includes('uber')).length,   color: 'var(--purple)'  },
      { icon: 'local_cafe',     label: 'Cafés',   val: all.filter(r => r.resources.includes('cafe')).length,   color: 'var(--yellow)'  },
      { icon: 'restaurant_menu',label: 'Almoços', val: all.filter(r => r.resources.includes('almoco')).length, color: 'var(--green)'   },
    ];
  }

  ngOnInit(): void {
    this.http.get<string[]>(`${environment.apiUrl}/departments`).subscribe({
      next: names => this.departments = names,
    });
    this.load(true);
    this.timer = setInterval(() => this.load(), 5000);
  }

  ngOnDestroy(): void { clearInterval(this.timer); }

  load(resetPage = false): void {
    this.reqSvc.getRequests(
      this.fltDept || undefined,
      this.fltDate || undefined
    ).subscribe({
      next: data => {
        this.requests = data;
        if (resetPage) { this.currentPage = 1; this.selectedIds.clear(); }
      },
      error: () => this.toast.show('Erro ao carregar solicitações', 'error')
    });
  }

  readonly pageSize = 7;
  currentPage = 1;

  get filteredRequests(): OvertimeRequest[] {
    if (!this.fltStatus) return this.requests;
    return this.requests.filter(r => r.status === this.fltStatus);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRequests.length / this.pageSize);
  }

  get pagedRequests(): OvertimeRequest[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRequests.slice(start, start + this.pageSize);
  }

  get pageNumbers(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
  }

  clearFilters(): void {
    this.fltDept = '';
    this.fltDate = '';
    this.fltStatus = '';
    this.load(true);
  }

  // ── Edit ──────────────────────────────────────────────────────────────────

  openEdit(r: OvertimeRequest): void {
    this.editingId = r.id;
    this.editingRequest = r;
    this.editState = {
      permanencia:    r.permanencia,
      motivo:         r.motivo,
      veiculoProprio: r.veiculoProprio,
      resources:      [...r.resources],
      loading:        false
    };
  }

  closeEdit(): void { this.editingId = null; this.editingRequest = null; this.editState = null; }

  availableResForEdit(): string[] {
    const r = this.editingRequest;
    if (!r) return [];
    const dayType = r.dayType;
    const perm = this.editState!.permanencia;
    if (dayType === 'weekday') {
      if (perm === '19:30') return ['lanche'];
      if (perm === '21:00') return ['janta', 'rota', 'uber'];
    } else {
      if (perm === 'until12') return ['cafe'];
      if (perm === 'after12') return ['cafe', 'almoco'];
    }
    return [];
  }

  onEditPermChange(): void {
    if (!this.editState) return;
    const avail = this.availableResForEdit();
    this.editState.resources = this.editState.resources.filter(r => avail.includes(r));
    if (this.editState.veiculoProprio) {
      this.editState.resources = this.editState.resources.filter(r => r !== 'rota' && r !== 'uber');
    }
  }

  toggleEditVeiculo(): void {
    if (!this.editState) return;
    this.editState.veiculoProprio = !this.editState.veiculoProprio;
    if (this.editState.veiculoProprio) {
      this.editState.resources = this.editState.resources.filter(r => r !== 'rota' && r !== 'uber');
    }
  }

  toggleEditRes(key: string): void {
    if (!this.editState) return;
    const i = this.editState.resources.indexOf(key);
    if (i === -1) this.editState.resources.push(key);
    else this.editState.resources.splice(i, 1);
  }

  isEditResLocked(key: string): boolean {
    return !!this.editState?.veiculoProprio && (key === 'rota' || key === 'uber');
  }

  saveEdit(): void {
    if (!this.editingId || !this.editState) return;
    if (!this.editState.motivo.trim()) { this.toast.show('Preencha o motivo', 'error'); return; }
    if (!this.editState.resources.length) { this.toast.show('Selecione ao menos um recurso', 'error'); return; }

    this.editState.loading = true;
    this.reqSvc.updateRequest(this.editingId, {
      permanencia:    this.editState.permanencia,
      motivo:         this.editState.motivo.trim(),
      veiculoProprio: this.editState.veiculoProprio,
      resources:      this.editState.resources
    }).subscribe({
      next: () => { this.toast.show('Solicitação atualizada!'); this.closeEdit(); this.load(); },
      error: err => {
        this.toast.show(err.error?.error ?? 'Erro ao atualizar', 'error');
        this.editState!.loading = false;
      }
    });
  }

  // ── Confirm individual ────────────────────────────────────────────────────

  private hasRotaUberConflict(r: OvertimeRequest): boolean {
    return r.resources.includes('rota') && r.resources.includes('uber');
  }

  doConfirm(id: string): void {
    const r = this.requests.find(req => req.id === id);
    if (r && this.hasRotaUberConflict(r)) {
      this.toast.show(
        `${r.name} possui Rota e Uber selecionados. Apenas um pode ser confirmado.`,
        'error'
      );
      return;
    }
    this.reqSvc.confirmRequest(id).subscribe({
      next: () => { this.toast.show('Solicitação confirmada!'); this.load(); },
      error: err => this.toast.show(err.error?.error ?? 'Erro ao confirmar', 'error')
    });
  }

  // ── Seleção múltipla ──────────────────────────────────────────────────────

  get pendingRequests(): OvertimeRequest[] {
    return this.filteredRequests.filter(r => r.status === 'PENDENTE');
  }

  get allPageSelected(): boolean {
    const pending = this.pagedRequests.filter(r => r.status === 'PENDENTE');
    return pending.length > 0 && pending.every(r => this.selectedIds.has(r.id));
  }

  toggleSelectAll(): void {
    const pending = this.pagedRequests.filter(r => r.status === 'PENDENTE');
    if (this.allPageSelected) {
      pending.forEach(r => this.selectedIds.delete(r.id));
    } else {
      pending.forEach(r => this.selectedIds.add(r.id));
    }
  }

  toggleSelect(id: string): void {
    if (this.selectedIds.has(id)) this.selectedIds.delete(id);
    else this.selectedIds.add(id);
  }

  confirmSelected(): void {
    if (!this.selectedIds.size) return;

    const conflicts = this.requests.filter(
      r => this.selectedIds.has(r.id) && this.hasRotaUberConflict(r)
    );
    if (conflicts.length) {
      const names = conflicts.map(r => r.name).join(', ');
      this.toast.show(
        `Rota e Uber selecionados ao mesmo tempo: ${names}. Corrija antes de confirmar.`,
        'error'
      );
      return;
    }

    const calls = Array.from(this.selectedIds).map(id => this.reqSvc.confirmRequest(id));
    forkJoin(calls).subscribe({
      next: () => {
        this.toast.show(`${calls.length} solicitação(ões) confirmada(s)!`);
        this.confirmingBulk = false;
        this.load();
      },
      error: err => this.toast.show(err.error?.error ?? 'Erro ao confirmar', 'error')
    });
  }

  // ── Cancel ────────────────────────────────────────────────────────────────

  confirmCancel(id: string): void { this.cancelingId = id; }
  closeCancel(): void { this.cancelingId = null; }

  doCancel(): void {
    if (!this.cancelingId) return;
    this.reqSvc.deleteRequest(this.cancelingId).subscribe({
      next: () => { this.toast.show('Solicitação cancelada!'); this.closeCancel(); this.load(); },
      error: err => this.toast.show(err.error?.error ?? 'Erro ao cancelar', 'error')
    });
  }

  openCancelConfirmed(id: string): void { this.cancelingConfirmedId = id; this.cancelReason = ''; }
  closeCancelConfirmed(): void { this.cancelingConfirmedId = null; this.cancelReason = ''; }

  doCancelConfirmed(): void {
    if (!this.cancelingConfirmedId) return;
    if (!this.cancelReason.trim()) { this.toast.show('Informe o motivo do cancelamento', 'error'); return; }
    this.reqSvc.cancelConfirmedRequest(this.cancelingConfirmedId, this.cancelReason.trim()).subscribe({
      next: () => { this.toast.show('Solicitação cancelada!'); this.closeCancelConfirmed(); this.load(); },
      error: err => this.toast.show(err.error?.error ?? 'Erro ao cancelar', 'error')
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  private static readonly DEPT_PALETTE = [
    { bg: 'rgba(220,38,38,.13)',   color: '#b91c1c' },  // 0 — Vermelho
    { bg: 'rgba(37,99,235,.13)',   color: '#1e40af' },  // 1 — Azul       ← TI
    { bg: 'rgba(5,150,105,.13)',   color: '#047857' },  // 2 — Esmeralda
    { bg: 'rgba(234,88,12,.13)',   color: '#c2410c' },  // 3 — Laranja
    { bg: 'rgba(124,58,237,.13)',  color: '#6d28d9' },  // 4 — Violeta
    { bg: 'rgba(8,145,178,.13)',   color: '#0e7490' },  // 5 — Ciano
    { bg: 'rgba(202,138,4,.13)',   color: '#a16207' },  // 6 — Âmbar
    { bg: 'rgba(219,39,119,.13)',  color: '#9d174d' },  // 7 — Rosa
    { bg: 'rgba(101,163,13,.13)',  color: '#4d7c0f' },  // 8 — Lima
    { bg: 'rgba(67,56,202,.13)',   color: '#3730a3' },  // 9 — Índigo
    { bg: 'rgba(15,118,110,.13)',  color: '#0f766e' },  // 10 — Teal
    { bg: 'rgba(244,63,94,.13)',   color: '#be123c' },  // 11 — Rosa-forte
  ];

  deptStyle(name: string): Record<string, string> {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    const p = PanelComponent.DEPT_PALETTE[hash % PanelComponent.DEPT_PALETTE.length];
    return { background: p.bg, color: p.color };
  }

  fmtDate(ds: string): string {
    if (!ds) return '';
    const [y, m, d] = ds.split('-');
    return `${d}/${m}/${y}`;
  }

  fmtDT(ts: string): string {
    return new Date(ts).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  permLabel(p: string): string { return this.permLabels[p] ?? p; }

  permOptionsFor(r: OvertimeRequest): { value: string; label: string }[] {
    return r.dayType === 'weekday'
      ? [{ value: '19:30', label: 'Até 19:30' }, { value: '21:00', label: 'Até 21:00' }]
      : [{ value: 'until12', label: 'Até 12h' }, { value: 'after12', label: 'Após 12h' }];
  }

  canEdit(r: OvertimeRequest): boolean {
    return this.isAdmin || r.department === this.auth.getDepartment();
  }

  gerarRelatorio(): void {
    const hoje = this.fltDate || new Date().toISOString().split('T')[0];
    const reqs = this.requests.filter(r => r.date === hoje && r.status === 'CONFIRMADO');

    const rows: Record<string, string | number>[] = reqs.map(r => {
      const dt = new Date(r.registeredAt);
      const data = dt.toLocaleDateString('pt-BR');
      const hora = dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      return {
      'Nome':           r.name,
      'Departamento':   r.department,
      'Endereço':       r.address ?? '',
      'Status':         r.status,
      'Data Registro':  data,
      'Hora Registro':  hora,
      'Lanche': r.resources.includes('lanche') ? 'Sim' : '',
      'Café':   r.resources.includes('cafe')   ? 'Sim' : '',
      'Almoço': r.resources.includes('almoco') ? 'Sim' : '',
      'Janta':  r.resources.includes('janta')  ? 'Sim' : '',
      'Uber':   r.resources.includes('uber')   ? 'Sim' : '',
      'Rota':   r.resources.includes('rota')   ? 'Sim' : '',
      };
    });

    rows.push({
      'Nome':           'TOTAL',
      'Departamento':   '',
      'Endereço':       '',
      'Status':         '',
      'Data Registro':  '',
      'Hora Registro':  '',
      'Lanche': reqs.filter(r => r.resources.includes('lanche')).length,
      'Café':   reqs.filter(r => r.resources.includes('cafe')).length,
      'Almoço': reqs.filter(r => r.resources.includes('almoco')).length,
      'Janta':  reqs.filter(r => r.resources.includes('janta')).length,
      'Uber':   reqs.filter(r => r.resources.includes('uber')).length,
      'Rota':   reqs.filter(r => r.resources.includes('rota')).length,
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório');

    // Largura: Nome, Departamento, Endereço, Status, Data Registro, Hora Registro, recursos...
    ws['!cols'] = [{ wch: 35 }, { wch: 20 }, { wch: 45 }, { wch: 12 }, { wch: 14 }, { wch: 12 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 8 }, { wch: 8 }, { wch: 8 }];

    const [y, m, d] = hoje.split('-');
    XLSX.writeFile(wb, `relatorio_${d}-${m}-${y}.xlsx`);
  }
}

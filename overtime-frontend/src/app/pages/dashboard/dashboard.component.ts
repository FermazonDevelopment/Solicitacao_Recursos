import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import { OvertimeRequestService } from '../../core/services/overtime-request.service';
import { ToastService } from '../../shared/toast/toast.service';
import { DashboardData } from '../../core/models/overtime-request.model';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';

const RES_CFG: Record<string, { label: string; icon: string; color: string }> = {
  lanche: { label: 'Lanche', icon: 'lunch_dining',    color: 'var(--yellow)'  },
  janta:  { label: 'Janta',  icon: 'restaurant',      color: 'var(--green)'   },
  rota:   { label: 'Rota',   icon: 'directions_bus',  color: 'var(--blue)'    },
  uber:   { label: 'Uber',   icon: 'local_taxi',      color: 'var(--purple)'  },
  cafe:   { label: 'Café',   icon: 'local_cafe',      color: 'var(--yellow)'  },
  almoco: { label: 'Almoço', icon: 'restaurant_menu', color: 'var(--green)'   },
};

const PERM_LABELS: Record<string, string> = {
  '19:30': 'Até 19:30', '21:00': 'Até 21:00', 'until12': 'Até 12h', 'after12': 'Após 12h'
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatIconModule, DatePickerComponent],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private reqSvc = inject(OvertimeRequestService);
  private toast  = inject(ToastService);

  data: DashboardData | null = null;
  resCfg = RES_CFG;
  resKeys = Object.keys(RES_CFG);
  permLabels = PERM_LABELS;
  today = new Date().toISOString().slice(0, 10);

  filterFrom = '';
  filterTo   = '';

  ngOnInit(): void { this.load(); }

  load(): void {
    this.data = null;
    this.reqSvc.getDashboard(this.filterFrom || undefined, this.filterTo || undefined).subscribe({
      next: d => this.data = d,
      error: () => this.toast.show('Erro ao carregar dashboard', 'error')
    });
  }

  clearPeriod(): void {
    this.filterFrom = '';
    this.filterTo   = '';
    this.load();
  }

  maxOf(obj: Record<string, number>): number {
    return Math.max(...Object.values(obj), 1);
  }

  pct(val: number, max: number): number {
    return Math.round(val / max * 100);
  }

  entries(obj: Record<string, number>): [string, number][] {
    return Object.entries(obj).sort((a, b) => b[1] - a[1]);
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  permLabel(p: string): string { return this.permLabels[p] ?? p; }

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
    const p = DashboardComponent.DEPT_PALETTE[hash % DashboardComponent.DEPT_PALETTE.length];
    return { background: p.bg, color: p.color };
  }

  gerarRelatorio(): void {
    if (!this.filterFrom || !this.filterTo) {
      this.toast.show('Selecione o período antes de gerar o relatório', 'error');
      return;
    }
    this.reqSvc.getRequests().subscribe({
      next: reqs => {
        const filtered = reqs.filter(r => r.date >= this.filterFrom && r.date <= this.filterTo);
        if (!filtered.length) { this.toast.show('Nenhuma solicitação no período selecionado', 'error'); return; }

        const rows = filtered.map(r => {
          const dt = new Date(r.registeredAt);
          return {
            'Nome':              r.name,
            'Departamento':      r.department,
            'Endereço':          r.address ?? '',
            'Data':              r.date.split('-').reverse().join('/'),
            'Permanência':       this.permLabel(r.permanencia),
            'Status':            r.status,
            'Lanche':  r.resources.includes('lanche') ? 'Sim' : '',
            'Café':    r.resources.includes('cafe')   ? 'Sim' : '',
            'Almoço':  r.resources.includes('almoco') ? 'Sim' : '',
            'Janta':   r.resources.includes('janta')  ? 'Sim' : '',
            'Uber':    r.resources.includes('uber')   ? 'Sim' : '',
            'Rota':    r.resources.includes('rota')   ? 'Sim' : '',
            'Veículo Próprio':   r.veiculoProprio ? 'Sim' : 'Não',
            'Motivo':            r.motivo ?? '',
            'Registrado por':    r.registeredBy,
            'Data Registro':     dt.toLocaleDateString('pt-BR'),
            'Hora Registro':     dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            'Motivo Cancelamento': r.cancellationReason ?? '',
          };
        });

        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [
          { wch: 35 }, { wch: 20 }, { wch: 45 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
          { wch: 8  }, { wch: 8  }, { wch: 8  }, { wch: 8  }, { wch: 8  }, { wch: 8  },
          { wch: 14 }, { wch: 40 }, { wch: 20 }, { wch: 14 }, { wch: 12 }, { wch: 30 },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Relatório Geral');

        const [y1, m1, d1] = this.filterFrom.split('-');
        const [y2, m2, d2] = this.filterTo.split('-');
        XLSX.writeFile(wb, `relatorio_${d1}-${m1}-${y1}_a_${d2}-${m2}-${y2}.xlsx`);
      },
      error: () => this.toast.show('Erro ao gerar relatório', 'error')
    });
  }

  trendBarPct(count: number): number {
    if (!this.data) return 4;
    const maxW = Math.max(...this.data.weekTrend.map(w => w.count), 1);
    return Math.max(Math.round(count / maxW * 100), 4);
  }
}

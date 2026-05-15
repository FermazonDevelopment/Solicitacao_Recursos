import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { OvertimeRequestService } from '../../core/services/overtime-request.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Employee } from '../../core/models/employee.model';
import { CollabEntry } from '../../core/models/overtime-request.model';

const HOLIDAYS = new Set([
  '2025-01-01','2025-04-18','2025-04-21','2025-05-01','2025-06-19',
  '2025-09-07','2025-10-12','2025-11-02','2025-11-15','2025-11-20','2025-12-25',
  '2026-01-01','2026-04-03','2026-04-21','2026-05-01','2026-06-04',
  '2026-09-07','2026-10-12','2026-11-02','2026-11-15','2026-11-20','2026-12-25',
]);

const RES_CFG: Record<string, { label: string; icon: string; cls: string }> = {
  lanche: { label: 'Lanche', icon: 'lunch_dining',    cls: 'ri-lanche' },
  janta:  { label: 'Janta',  icon: 'restaurant',      cls: 'ri-janta'  },
  rota:   { label: 'Rota',   icon: 'directions_bus',  cls: 'ri-rota'   },
  uber:   { label: 'Uber',   icon: 'local_taxi',      cls: 'ri-uber'   },
  cafe:   { label: 'Café',   icon: 'local_cafe',      cls: 'ri-cafe'   },
  almoco: { label: 'Almoço', icon: 'restaurant_menu', cls: 'ri-almoco' },
};

interface CollabData {
  motivo: string;
  veiculo: boolean;
  resources: string[];
}

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, DatePickerComponent],
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  auth    = inject(AuthService);
  private empSvc = inject(EmployeeService);
  private reqSvc = inject(OvertimeRequestService);
  private toast  = inject(ToastService);

  employees: Employee[] = [];
  msQuery = '';

  fDate = '';
  dayType = '';
  permanencia = '';
  selCollabs: number[] = [];
  collabData: Record<number, CollabData> = {};

  resCfg = RES_CFG;
  resKeys = Object.keys(RES_CFG);

  get availableResKeys(): string[] {
    if (this.dayType === 'weekday') {
      if (this.permanencia === '19:30') return ['lanche'];
      if (this.permanencia === '21:00') return ['janta', 'rota', 'uber'];
    } else {
      if (this.permanencia === 'until12') return ['cafe'];
      if (this.permanencia === 'after12') return ['cafe', 'almoco'];
    }
    return [];
  }

  get isAdmin(): boolean { return this.auth.isAdmin(); }
  get deadlinePassed(): boolean { return new Date().getHours() >= 14; }
  get blocked(): boolean { return this.deadlinePassed && !this.isAdmin; }

  get today(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  get filteredEmployees(): Employee[] {
    const q = this.msQuery.toLowerCase();
    return this.employees.filter(e =>
      e.name.toLowerCase().includes(q) || e.department.toLowerCase().includes(q)
    );
  }

  ngOnInit(): void {
    this.empSvc.getEmployees().subscribe({
      next: emps => this.employees = emps,
      error: () => this.toast.show('Erro ao carregar colaboradores', 'error')
    });
  }

  getDayType(ds: string): string {
    if (!ds) return '';
    const d = new Date(ds + 'T12:00:00');
    const dow = d.getDay();
    return (HOLIDAYS.has(ds) || dow === 0 || dow === 6) ? 'weekend' : 'weekday';
  }

  calcResources(dayType: string, perm: string, veiculo: boolean): string[] {
    const res = new Set<string>();
    if (dayType === 'weekday') {
      if (perm === '19:30') res.add('lanche');
      if (perm === '21:00') { res.add('janta'); res.add('rota'); res.add('uber'); }
    } else {
      res.add('cafe');
      if (perm === 'after12') res.add('almoco');
    }
    if (veiculo) { res.delete('rota'); res.delete('uber'); }
    return [...res];
  }

  onDateChange(): void {
    this.dayType = this.getDayType(this.fDate);
    this.permanencia = '';
    this.selCollabs = [];
    this.collabData = {};
  }

  onPermChange(): void {
    this.selCollabs.forEach(id => {
      if (this.collabData[id]) {
        this.collabData[id].resources = this.calcResources(this.dayType, this.permanencia, this.collabData[id].veiculo);
      }
    });
  }

  toggleCollab(id: number): void {
    const idx = this.selCollabs.indexOf(id);
    if (idx === -1) {
      this.selCollabs.push(id);
      this.collabData[id] = { motivo: '', veiculo: false, resources: this.calcResources(this.dayType, this.permanencia, false) };
    } else {
      this.selCollabs.splice(idx, 1);
      delete this.collabData[id];
    }
  }

  removeCollab(id: number): void {
    this.selCollabs = this.selCollabs.filter(c => c !== id);
    delete this.collabData[id];
  }

  toggleVeiculo(id: number): void {
    if (!this.collabData[id]) return;
    this.collabData[id].veiculo = !this.collabData[id].veiculo;
    this.collabData[id].resources = this.calcResources(this.dayType, this.permanencia, this.collabData[id].veiculo);
  }

  isResLocked(id: number, key: string): boolean {
    return !!this.collabData[id]?.veiculo && (key === 'rota' || key === 'uber');
  }

  toggleRes(id: number, res: string): void {
    if (!this.collabData[id]) return;
    const arr = this.collabData[id].resources;
    const i = arr.indexOf(res);
    if (i === -1) arr.push(res); else arr.splice(i, 1);
  }

  getEmployee(id: number): Employee | undefined {
    return this.employees.find(e => e.id === id);
  }

  initials(name: string): string {
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  }

  permLabel(p: string): string {
    const map: Record<string, string> = { '19:30': 'Até 19:30', '21:00': 'Até 21:00', 'until12': 'Até 12h', 'after12': 'Após 12h' };
    return map[p] ?? p;
  }

  dayTypeLabel(dt: string): string {
    return dt === 'weekday' ? 'Dia Útil' : 'Fim de Semana / Feriado';
  }

  replicateMotivo(sourceId: number): void {
    const motivo = this.collabData[sourceId]?.motivo?.trim();
    if (!motivo) return;
    this.selCollabs.forEach(id => {
      if (id !== sourceId && this.collabData[id]) {
        this.collabData[id].motivo = motivo;
      }
    });
    this.toast.show('Motivo replicado para todos os colaboradores');
  }

  clearForm(): void {
    this.fDate = ''; this.dayType = ''; this.permanencia = '';
    this.selCollabs = []; this.collabData = {};
  }

  submit(): void {
    if (!this.fDate)        { this.toast.show('Selecione uma data', 'error'); return; }
    if (this.fDate < this.today) { this.toast.show('Não é permitido registrar solicitações para datas retroativas', 'error'); return; }
    if (!this.permanencia)  { this.toast.show('Selecione a permanência', 'error'); return; }
    if (!this.selCollabs.length) { this.toast.show('Selecione ao menos um colaborador', 'error'); return; }

    const noMotivo = this.selCollabs.filter(id => !this.collabData[id]?.motivo?.trim());
    if (noMotivo.length) { this.toast.show('Preencha o motivo de todos os colaboradores', 'error'); return; }

    const collaborators: CollabEntry[] = this.selCollabs.map(id => ({
      employeeId: id,
      motivo: this.collabData[id].motivo.trim(),
      veiculoProprio: this.collabData[id].veiculo,
      resources: this.collabData[id].resources
    }));

    this.reqSvc.createRequests({ date: this.fDate, permanencia: this.permanencia, collaborators }).subscribe({
      next: res => {
        this.toast.show(`${res.length} solicitação(ões) registrada(s) com sucesso!`);
        this.clearForm();
      },
      error: err => this.toast.show(err.error?.error ?? 'Erro ao registrar', 'error')
    });
  }
}

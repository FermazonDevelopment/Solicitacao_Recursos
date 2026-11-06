import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import * as XLSX from 'xlsx';
import { OvertimeRequestService } from '../../core/services/overtime-request.service';
import { ToastService } from '../../shared/toast/toast.service';
import { DashboardData } from '../../core/models/overtime-request.model';
import { DatePickerComponent } from '../../shared/date-picker/date-picker.component';

const RES_CFG: Record<string, { label: string; icon: string; color: string }> = {
  lanche: { label: 'Lanche', icon: 'lunch_dining',    color: 'var(--chart-1)'  },
  janta:  { label: 'Janta',  icon: 'restaurant',      color: 'var(--chart-1)'   },
  rota:   { label: 'Rota',   icon: 'directions_bus',  color: 'var(--chart-1)'    },
  uber:   { label: 'Uber',   icon: 'local_taxi',      color: 'var(--chart-1)'  },
  cafe:   { label: 'Café',   icon: 'local_cafe',      color: 'var(--chart-1)'  },
  almoco: { label: 'Almoço', icon: 'restaurant_menu', color: 'var(--chart-1)'   },
};

const PERM_LABELS: Record<string, string> = {
  '19:30': 'Até 19:30', '21:00': 'Até 21:00', 'until12': 'Até 12h', 'after12': 'Após 12h', 'especial': 'Jornada Especial'
};

type ChartKey = 'resources' | 'departments' | 'permanencia' | 'collaborators' | 'trend' | 'outsourcedResources' | 'companies';

const CHART_META: Record<ChartKey, { title: string; icon: string }> = {
  resources:            { title: 'Recursos Mais Solicitados',        icon: 'bar_chart'    },
  departments:          { title: 'Horas Extras por Setor',           icon: 'apartment'    },
  permanencia:          { title: 'Distribuição de Horários',         icon: 'schedule'     },
  collaborators:        { title: 'Ranking de Colaboradores',         icon: 'emoji_events' },
  trend:                { title: 'Tendência — Últimos 7 Dias',       icon: 'trending_up'  },
  outsourcedResources:  { title: 'Recursos Fornecidos a Terceirizados', icon: 'engineering'  },
  companies:            { title: 'Solicitações por Empresa Terceirizada', icon: 'domain' },
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

  expandedChart: ChartKey | null = null;
  modalData: DashboardData | null = null;
  modalLoading = false;
  modalFrom = '';
  modalTo   = '';

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

  get modalMeta(): { title: string; icon: string } | null {
    return this.expandedChart ? CHART_META[this.expandedChart] : null;
  }

  openChart(key: ChartKey): void {
    this.expandedChart = key;
    this.modalFrom = this.filterFrom;
    this.modalTo   = this.filterTo;
    this.modalData = this.data;
    if (key !== 'trend') this.loadModalData();
  }

  closeChart(): void {
    this.expandedChart = null;
    this.modalData = null;
  }

  loadModalData(): void {
    this.modalLoading = true;
    this.reqSvc.getDashboard(this.modalFrom || undefined, this.modalTo || undefined).subscribe({
      next: d => { this.modalData = d; this.modalLoading = false; },
      error: () => { this.toast.show('Erro ao carregar período', 'error'); this.modalLoading = false; }
    });
  }

  clearModalPeriod(): void {
    this.modalFrom = '';
    this.modalTo   = '';
    this.loadModalData();
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
            'Terceirizado':      r.outsourced ? 'Sim' : 'Não',
            'Empresa':           r.companyName ?? '',
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
          { wch: 35 }, { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 45 }, { wch: 12 }, { wch: 12 },
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
    return this.trendBarPctIn(count, this.data.weekTrend);
  }

  trendBarPctIn(count: number, trend: { count: number }[]): number {
    const maxW = Math.max(...trend.map(w => w.count), 1);
    return Math.max(Math.round(count / maxW * 100), 4);
  }
}

export interface OvertimeRequest {
  id: string;
  employeeId: number;
  name: string;
  department: string;
  registration: string;
  address: string;
  outsourced: boolean;
  companyName?: string;
  date: string;
  dayType: 'weekday' | 'weekend';
  permanencia: string;
  veiculoProprio: boolean;
  motivo: string;
  resources: string[];
  registeredBy: string;
  registeredAt: string;
  status: 'PENDENTE' | 'CONFIRMADO' | 'CANCELADO';
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface OvertimeRequestCreate {
  date: string;
  permanencia: string;
  collaborators: CollabEntry[];
}

export interface CollabEntry {
  employeeId: number;
  motivo: string;
  veiculoProprio: boolean;
  resources: string[];
}

export interface DashboardData {
  total: number;
  confirmedCount: number;
  pendingCount: number;
  todayCount: number;
  resourceCounts: Record<string, number>;
  departmentCounts: Record<string, number>;
  permanenciaCounts: Record<string, number>;
  outsourcedResourceCounts: Record<string, number>;
  companyCounts: Record<string, number>;
  topCollaborators: { name: string; count: number }[];
  weekTrend: { date: string; label: string; count: number }[];
}

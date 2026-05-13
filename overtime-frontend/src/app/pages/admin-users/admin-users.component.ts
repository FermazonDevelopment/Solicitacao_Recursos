import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UserManagementService, DepartmentItem, EmployeeItem } from '../../core/services/user-management.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-users.component.html'
})
export class AdminUsersComponent implements OnInit {
  private svc   = inject(UserManagementService);
  private toast = inject(ToastService);

  tab: 'dept' | 'emp' = 'dept';

  departments: DepartmentItem[] = [];
  employees: EmployeeItem[]     = [];

  loadingDepts = false;
  loadingEmps  = false;

  busyDept = new Set<number>();
  busyEmp  = new Set<number>();

  confirmDeleteDept: number | null = null;
  confirmDeleteEmp:  number | null = null;

  empSearch    = '';
  hideInactive = false;

  get filteredEmployees(): EmployeeItem[] {
    const term = this.empSearch.trim().toLowerCase();
    return this.employees
      .filter(e => !this.hideInactive || e.active)
      .filter(e => !term ||
        e.name.toLowerCase().includes(term) ||
        e.department.toLowerCase().includes(term) ||
        e.registration.toLowerCase().includes(term))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadEmployees();
  }

  loadDepartments(): void {
    this.loadingDepts = true;
    this.svc.getDepartments().subscribe({
      next: d => { this.departments = d; this.loadingDepts = false; },
      error: () => { this.toast.show('Erro ao carregar departamentos', 'error'); this.loadingDepts = false; }
    });
  }

  loadEmployees(): void {
    this.loadingEmps = true;
    this.svc.getEmployees().subscribe({
      next: e => { this.employees = e; this.loadingEmps = false; },
      error: () => { this.toast.show('Erro ao carregar funcionários', 'error'); this.loadingEmps = false; }
    });
  }

  toggleAdmin(dept: DepartmentItem): void {
    this.busyDept.add(dept.id);
    this.svc.toggleAdmin(dept.id).subscribe({
      next: updated => {
        const idx = this.departments.findIndex(d => d.id === updated.id);
        if (idx !== -1) this.departments[idx] = updated;
        this.busyDept.delete(dept.id);
        this.toast.show(`${updated.name}: Admin ${updated.admin ? 'ativado' : 'removido'}`);
      },
      error: err => {
        this.toast.show(err.error?.message ?? 'Erro ao alterar permissão', 'error');
        this.busyDept.delete(dept.id);
      }
    });
  }

  deleteDept(id: number): void {
    this.busyDept.add(id);
    this.confirmDeleteDept = null;
    this.svc.deleteDepartment(id).subscribe({
      next: () => {
        this.departments = this.departments.filter(d => d.id !== id);
        this.busyDept.delete(id);
        this.toast.show('Departamento excluído com sucesso');
      },
      error: err => {
        this.toast.show(err.error?.message ?? 'Erro ao excluir departamento', 'error');
        this.busyDept.delete(id);
      }
    });
  }

  toggleActive(emp: EmployeeItem): void {
    this.busyEmp.add(emp.id);
    this.svc.toggleActive(emp.id).subscribe({
      next: updated => {
        const idx = this.employees.findIndex(e => e.id === updated.id);
        if (idx !== -1) this.employees[idx] = updated;
        this.busyEmp.delete(emp.id);
        this.toast.show(`${updated.name}: ${updated.active ? 'Ativado' : 'Desativado'}`);
      },
      error: err => {
        this.toast.show(err.error?.message ?? 'Erro ao alterar status', 'error');
        this.busyEmp.delete(emp.id);
      }
    });
  }

  deleteEmp(id: number): void {
    this.busyEmp.add(id);
    this.confirmDeleteEmp = null;
    this.svc.deleteEmployee(id).subscribe({
      next: () => {
        this.employees = this.employees.filter(e => e.id !== id);
        this.busyEmp.delete(id);
        this.toast.show('Funcionário excluído com sucesso');
      },
      error: err => {
        this.toast.show(err.error?.message ?? 'Erro ao excluir funcionário', 'error');
        this.busyEmp.delete(id);
      }
    });
  }

  initials(name: string): string {
    return name.trim().slice(0, 2).toUpperCase();
  }
}

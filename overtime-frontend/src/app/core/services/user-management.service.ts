import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DepartmentItem {
  id: number;
  name: string;
  admin: boolean;
  employeeCount: number;
}

export interface EmployeeItem {
  id: number;
  name: string;
  department: string;
  registration: string;
  address: string;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class UserManagementService {
  private base = `${environment.apiUrl}/management`;

  constructor(private http: HttpClient) {}

  getDepartments(): Observable<DepartmentItem[]> {
    return this.http.get<DepartmentItem[]>(`${this.base}/departments`);
  }

  toggleAdmin(id: number): Observable<DepartmentItem> {
    return this.http.patch<DepartmentItem>(`${this.base}/departments/${id}/toggle-admin`, {});
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.base}/departments/${id}`);
  }

  getEmployees(): Observable<EmployeeItem[]> {
    return this.http.get<EmployeeItem[]>(`${this.base}/employees`);
  }

  toggleActive(id: number): Observable<EmployeeItem> {
    return this.http.patch<EmployeeItem>(`${this.base}/employees/${id}/toggle-active`, {});
  }

  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.base}/employees/${id}`);
  }
}

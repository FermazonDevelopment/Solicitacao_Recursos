import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardData, OvertimeRequest, OvertimeRequestCreate } from '../models/overtime-request.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OvertimeRequestService {
  constructor(private http: HttpClient) {}

  getRequests(filterDept?: string, filterDate?: string): Observable<OvertimeRequest[]> {
    let params = new HttpParams();
    if (filterDept) params = params.set('dept', filterDept);
    if (filterDate) params = params.set('date', filterDate);
    return this.http.get<OvertimeRequest[]>(`${environment.apiUrl}/requests`, { params });
  }

  createRequests(payload: OvertimeRequestCreate): Observable<OvertimeRequest[]> {
    return this.http.post<OvertimeRequest[]>(`${environment.apiUrl}/requests`, payload);
  }

  updateRequest(id: string, payload: { permanencia: string; motivo: string; veiculoProprio: boolean; resources: string[] }): Observable<OvertimeRequest> {
    return this.http.put<OvertimeRequest>(`${environment.apiUrl}/requests/${id}`, payload);
  }

  deleteRequest(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/requests/${id}`);
  }

  confirmRequest(id: string): Observable<OvertimeRequest> {
    return this.http.patch<OvertimeRequest>(`${environment.apiUrl}/requests/${id}/confirm`, {});
  }

  cancelConfirmedRequest(id: string, reason: string): Observable<OvertimeRequest> {
    return this.http.patch<OvertimeRequest>(`${environment.apiUrl}/requests/${id}/cancel`, { reason });
  }

  getDashboard(from?: string, to?: string): Observable<DashboardData> {
    let params = new HttpParams();
    if (from) params = params.set('from', from);
    if (to)   params = params.set('to', to);
    return this.http.get<DashboardData>(`${environment.apiUrl}/dashboard`, { params });
  }
}

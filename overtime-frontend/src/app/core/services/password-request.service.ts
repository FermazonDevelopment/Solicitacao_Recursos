import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PasswordService {
  private readonly base = `${environment.apiUrl}/passwords`;

  constructor(private http: HttpClient) {}

  /** Qualquer departamento troca a própria senha */
  changeOwn(currentPassword: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.base}/me`, { currentPassword, newPassword });
  }

  /** TI / Admin: lista todos os departamentos */
  getDepartments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.base}/departments`);
  }

  /** TI / Admin: redefine senha de qualquer departamento */
  changeDeptPassword(name: string, newPassword: string): Observable<void> {
    return this.http.put<void>(`${this.base}/departments/${encodeURIComponent(name)}`, { newPassword });
  }
}

import { Injectable, signal, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthState, LoginRequest, LoginResponse } from '../models/auth.model';
import { environment } from '../../../environments/environment';

// 30 minutes of inactivity triggers logout
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'ot_token';
  private readonly USER_KEY  = 'ot_user';

  auth = signal<AuthState | null>(this.loadState());

  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(private http: HttpClient, private router: Router, private zone: NgZone) {}

  login(req: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/auth/login`, req).pipe(
      tap(res => {
        const state: AuthState = { token: res.token, department: res.department, admin: res.admin };
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(state));
        this.auth.set(state);
        this.startInactivityWatch();
      })
    );
  }

  logout(): void {
    this.stopInactivityWatch();
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.auth.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.auth();
  }

  isAdmin(): boolean {
    return this.auth()?.admin ?? false;
  }

  getDepartment(): string {
    return this.auth()?.department ?? '';
  }

  startInactivityWatch(): void {
    if (!this.isLoggedIn()) return;
    this.stopInactivityWatch();
    // Run outside Angular zone so change detection is not triggered on every mouse move
    this.zone.runOutsideAngular(() => {
      const reset = () => this.resetInactivityTimer();
      ACTIVITY_EVENTS.forEach(ev => window.addEventListener(ev, reset, { passive: true }));
      (this as any)._activityListener = reset;
      this.resetInactivityTimer();
    });
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) clearTimeout(this.inactivityTimer);
    this.inactivityTimer = setTimeout(() => {
      this.zone.run(() => this.logout());
    }, INACTIVITY_TIMEOUT_MS);
  }

  private stopInactivityWatch(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    const listener = (this as any)._activityListener;
    if (listener) {
      ACTIVITY_EVENTS.forEach(ev => window.removeEventListener(ev, listener));
      delete (this as any)._activityListener;
    }
  }

  private loadState(): AuthState | null {
    try {
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { ThemeService } from '../../core/services/theme.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent, MatIconModule],
  styles: [`
    .login-hint { text-align:center; font-size:12px; color:var(--t3); }
    .login-hint strong { color:var(--t2); }
    .logo-icon-wrap { width:56px; height:56px; background:var(--primary-dim); border-radius:16px; display:flex; align-items:center; justify-content:center; margin:0 auto 16px; }
    .theme-corner { position:fixed; top:16px; right:16px; }
    .theme-btn {
      width:56px; height:28px; border-radius:100px;
      border:none; cursor:pointer; padding:3px;
      display:flex; align-items:center;
      background:#1e1e2e;
      transition:background 0.3s;
      position:relative; flex-shrink:0;
    }
    .theme-btn.light { background:#e2e8f0; }
    .theme-btn-thumb {
      width:22px; height:22px; border-radius:50%;
      background:#fff;
      display:flex; align-items:center; justify-content:center;
      transition:transform 0.3s cubic-bezier(.4,0,.2,1),background 0.3s;
      flex-shrink:0;
      box-shadow:0 1px 4px rgba(0,0,0,.25);
    }
    .theme-btn.light .theme-btn-thumb { transform:translateX(28px); background:#1e1e2e; }
    .theme-btn-icon { position:absolute; display:flex; align-items:center; justify-content:center; }
    .theme-btn-icon.moon { left:7px; }
    .theme-btn-icon.sun  { right:6px; }
  `],
  template: `
    <div class="theme-corner">
      <button class="theme-btn" [class.light]="!theme.isDark" (click)="theme.toggle()" [title]="theme.isDark ? 'Modo claro' : 'Modo escuro'">
        <span class="theme-btn-icon moon">
          <mat-icon class="icon-xs" style="color:#a5b4fc">dark_mode</mat-icon>
        </span>
        <span class="theme-btn-icon sun">
          <mat-icon class="icon-xs" style="color:#f59e0b">light_mode</mat-icon>
        </span>
        <span class="theme-btn-thumb"></span>
      </button>
    </div>
    <div class="login-page">
      <div class="login-card">
        <div class="logo-icon-wrap">
          <mat-icon class="icon-xl" style="color:var(--primary)">schedule</mat-icon>
        </div>
        <div class="login-title">Solicitação de Recursos</div>
        <div class="login-sub">Sistema de Solicitação de recursos para Horas Extras</div>

        <form [formGroup]="form" (ngSubmit)="submit()" class="form-grid" style="gap:16px">
          <div class="form-group">
            <label class="form-label">Departamento</label>
            <select class="form-control" formControlName="department">
              <option value="">Selecione...</option>
              @for (d of departments; track d) {
                <option [value]="d">{{ d }}</option>
              }
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Senha</label>
            <input type="password" class="form-control" formControlName="password" placeholder="Digite a senha" />
          </div>
          <button type="submit" class="btn btn-primary btn-full" style="margin-top:8px" [disabled]="loading">
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>

        <div class="divider"></div>
        <div class="login-hint">
          © 2026 Fermazon. Todos os direitos reservados.
        </div>
        <div style="text-align:center; margin-top:12px;">
          <img src="assets/logo-fermazon.png" alt="Fermazon" style="height:32px; width:auto; opacity:0.85;" />
        </div>
      </div>
    </div>
    <app-toast />
  `
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);
  private http   = inject(HttpClient);
  theme          = inject(ThemeService);

  departments: string[] = [];
  loading = false;

  constructor() {
    this.http.get<string[]>(`${environment.apiUrl}/departments`).subscribe({
      next: names => this.departments = names,
      error: () => this.toast.show('Erro ao carregar departamentos', 'error')
    });
  }

  form = this.fb.group({
    department: ['', Validators.required],
    password:   ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.toast.show('Preencha todos os campos', 'error');
      return;
    }
    this.loading = true;
    const { department, password } = this.form.value;
    this.auth.login({ department: department!, password: password! }).subscribe({
      next: res => {
        this.toast.show(`Bem-vindo, ${res.department}!`);
        this.router.navigate(['/form']);
      },
      error: err => {
        this.toast.show(err.error?.error ?? 'Credenciais inválidas', 'error');
        this.loading = false;
      }
    });
  }
}

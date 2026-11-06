import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ToastComponent } from '../../shared/toast/toast.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ToastComponent],
  styles: [`
    /*
     * Login padrão Fermazon (igual à Gestão de Bloqueios e à Fatura de Adiantamento):
     * página inteira em marinho com linhas diagonais discretas, filete vermelho na base
     * e cartão branco centralizado. Usa os tokens --fz-* direto para ficar igual
     * mesmo quando o tema escuro estiver ligado.
     */
    :host { display: block; }
    .login {
      position: relative; min-height: 100vh;
      display: grid; grid-template-columns: minmax(0, 1fr); place-items: center;
      padding: 24px 16px 32px;
      background: var(--fz-marinho); overflow: hidden;
    }
    .login::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: repeating-linear-gradient(135deg, rgba(255,255,255,.025) 0 2px, transparent 2px 22px);
    }
    .login::after {
      content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 4px;
      background: var(--fz-vermelho);
    }
    .login-conteudo { position: relative; width: 450px; max-width: 100%; }
    .login-cartao {
      background: #fff; color: var(--fz-texto); color-scheme: light;
      border-radius: 12px; box-shadow: 0 12px 40px rgba(13,35,64,.18); overflow: hidden;
    }
    .login-marca {
      display: flex; flex-direction: column; align-items: center; text-align: center;
      padding: 32px 32px 24px; border-bottom: 1px solid var(--fz-borda);
    }
    .login-logo { display: block; height: 34px; width: auto; margin-bottom: 20px; }
    .login-titulo {
      font: 700 26px/1.1 var(--fonte-titulo); color: var(--fz-marinho);
      text-transform: uppercase; letter-spacing: .02em;
    }
    .login-corpo { display: flex; flex-direction: column; gap: 16px; padding: 24px 32px 32px; }
    .campo { display: flex; flex-direction: column; gap: 6px; }
    .campo-rotulo { font-size: 13px; font-weight: 600; color: var(--fz-texto); }
    .input {
      height: 46px; width: 100%; padding: 0 14px;
      background: #fff; color: var(--fz-texto);
      border: 1px solid #cbd5e1; border-radius: 8px; outline: none;
      font-size: 14px; font-family: inherit;
      transition: border-color 160ms ease, box-shadow 160ms ease;
    }
    .input:hover:not(:disabled) { border-color: #94a3b8; }
    .input:focus { border-color: var(--fz-marinho-2); box-shadow: 0 0 0 3px rgba(25,59,99,.28); }
    .input::placeholder { color: #94a3b8; }
    select.input {
      cursor: pointer; appearance: none; padding-right: 40px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2366758a' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 14px center;
    }
    .btn-entrar {
      height: 48px; width: 100%; margin-top: 8px;
      display: inline-flex; align-items: center; justify-content: center; gap: 8px;
      background: var(--fz-vermelho); color: #fff; border: none; border-radius: 8px;
      font-size: 15px; font-weight: 600; cursor: pointer; font-family: inherit;
      transition: background 160ms ease, box-shadow 160ms ease;
    }
    .btn-entrar:hover:not(:disabled) { background: var(--fz-vermelho-hover); }
    .btn-entrar:focus-visible { box-shadow: 0 0 0 3px rgba(201,37,42,.35); }
    .btn-entrar:disabled { opacity: .7; cursor: not-allowed; }
    .login-rodape { margin-top: 20px; text-align: center; font-size: 12px; color: #8fa1b8; }
    @media (max-width: 480px) {
      .login-marca { padding: 24px 20px 20px; }
      .login-corpo { padding: 20px; }
      .login-titulo { font-size: 22px; }
    }
  `],
  template: `
    <section class="login">
      <main class="login-conteudo">
        <form class="login-cartao" [formGroup]="form" (ngSubmit)="submit()" aria-labelledby="login-titulo">
          <header class="login-marca">
            <img class="login-logo" src="assets/logo-fermazon.svg" alt="Fermazon" />
            <h1 class="login-titulo" id="login-titulo">Solicitação de Recursos</h1>
          </header>

          <div class="login-corpo">
            <div class="campo">
              <label class="campo-rotulo" for="login-departamento">Departamento</label>
              <select id="login-departamento" class="input" formControlName="department">
                <option value="">Selecione...</option>
                @for (d of departments; track d) {
                  <option [value]="d">{{ d }}</option>
                }
              </select>
            </div>
            <div class="campo">
              <label class="campo-rotulo" for="login-senha">Senha</label>
              <input id="login-senha" type="password" class="input" formControlName="password"
                     autocomplete="current-password" placeholder="Digite a senha" />
            </div>
            <button type="submit" class="btn-entrar" [disabled]="loading" [attr.aria-busy]="loading">
              @if (loading) { <span class="spin"></span> Entrando... } @else { Entrar }
            </button>
          </div>
        </form>

        <p class="login-rodape">© {{ ano }} Fermazon Ferro e Aço do Amazonas. Todos os direitos reservados.</p>
      </main>
    </section>
    <app-toast />
  `
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);
  private http   = inject(HttpClient);
  readonly ano   = new Date().getFullYear();

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

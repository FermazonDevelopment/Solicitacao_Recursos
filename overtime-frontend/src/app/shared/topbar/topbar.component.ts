import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '../../core/services/theme.service';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';

/**
 * Estilos em styles.css (seção CABEÇALHO DA APLICAÇÃO).
 * Cabeçalho institucional Fermazon: marinho, filete vermelho embaixo,
 * logo + nome da aplicação à esquerda; hora/prazo, tema e menu do usuário à direita.
 */
@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  template: `
    <header class="topo">
      <div class="marca">
        <button type="button" class="menu-mobile" (click)="sidebar.toggleMobile()" aria-label="Abrir menu">
          <mat-icon>menu</mat-icon>
        </button>
        <img class="marca-logo" src="assets/logo-fermazon-negativo.svg" alt="Fermazon" />
        <span class="marca-divisor" aria-hidden="true"></span>
        <div class="marca-textos">
          <span class="marca-nome">Solicitação de Recursos</span>
          <span class="marca-modulo">Horas Extras</span>
        </div>
      </div>

      <div class="direita">
        <div class="hora" [title]="deadlinePassed ? 'Prazo para solicitações encerrado (14:00)' : 'Solicitações abertas até 14:00'">
          <span class="time-dot" [class.danger]="deadlinePassed" [class.warn]="!deadlinePassed"></span>
          {{ currentTime }}
          @if (deadlinePassed) { <span class="prazo">Prazo encerrado</span> }
        </div>

        <button type="button" class="icone-btn" (click)="theme.toggle()"
                [title]="theme.isDark ? 'Modo claro' : 'Modo escuro'"
                [attr.aria-label]="theme.isDark ? 'Ativar modo claro' : 'Ativar modo escuro'">
          <mat-icon>{{ theme.isDark ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <span class="sep" aria-hidden="true"></span>

        <div class="conta" #conta>
          <button type="button" class="conta-botao" aria-haspopup="menu"
                  [attr.aria-expanded]="menuOpen" aria-controls="menu-conta"
                  (click)="menuOpen = !menuOpen">
            <span class="conta-textos">
              <span class="conta-nome">{{ department }}</span>
              <span class="conta-papel">{{ role }}</span>
            </span>
            <span class="avatar-topo" aria-hidden="true">{{ initials }}</span>
            <mat-icon class="icon-sm conta-seta">expand_more</mat-icon>
          </button>

          @if (menuOpen) {
            <div class="menu" id="menu-conta" role="menu">
              <div class="menu-cabecalho">
                <span class="avatar-topo" aria-hidden="true">{{ initials }}</span>
                <div>
                  <div class="menu-usuario-nome">{{ department }}</div>
                  <div class="menu-usuario-papel">{{ role }}</div>
                </div>
              </div>
              <a class="menu-item" role="menuitem" routerLink="/password-request" (click)="menuOpen = false">
                <mat-icon class="icon-sm">lock_reset</mat-icon> Trocar senha
              </a>
              <button type="button" class="menu-item sair" role="menuitem" (click)="auth.logout()">
                <mat-icon class="icon-sm">logout</mat-icon> Sair
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `
})
export class TopbarComponent implements OnInit, OnDestroy {
  theme   = inject(ThemeService);
  auth    = inject(AuthService);
  sidebar = inject(SidebarService);

  @ViewChild('conta') contaRef?: ElementRef<HTMLElement>;

  currentTime = '';
  deadlinePassed = false;
  menuOpen = false;

  private timer?: ReturnType<typeof setInterval>;

  get department(): string { return this.auth.getDepartment(); }

  get role(): string {
    if (this.department === 'TI') return 'Super-Admin';
    return this.auth.isAdmin() ? 'Administrador' : 'Departamento';
  }

  get initials(): string {
    const parts = (this.department || '').trim().split(/\s+/);
    return (parts.length > 1 ? parts[0][0] + parts[1][0] : (parts[0] || '').slice(0, 2)).toUpperCase();
  }

  @HostListener('document:click', ['$event'])
  onDocClick(e: MouseEvent): void {
    if (this.menuOpen && this.contaRef && !this.contaRef.nativeElement.contains(e.target as Node)) {
      this.menuOpen = false;
    }
  }

  @HostListener('document:keydown.escape')
  onEsc(): void { this.menuOpen = false; }

  ngOnInit(): void {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 10000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.deadlinePassed = now.getHours() >= 14;
  }
}

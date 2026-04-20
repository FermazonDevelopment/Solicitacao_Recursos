import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  styles: [`
    .topbar { height: 64px; border-bottom: 1px solid var(--border); padding: 0 32px; display: flex; align-items: center; justify-content: space-between; background: var(--card); position: sticky; top: 0; z-index: 50; }
    .page-title { font-size: 18px; font-weight: 700; letter-spacing: -0.3px; }
    .topbar-right { display: flex; align-items: center; gap: 14px; }
    .theme-btn {
      width: 56px; height: 28px; border-radius: 100px;
      border: none; cursor: pointer; padding: 3px;
      display: flex; align-items: center;
      background: #1e1e2e;
      transition: background 0.3s;
      position: relative; flex-shrink: 0;
    }
    .theme-btn.light { background: #e2e8f0; }
    .theme-btn-thumb {
      width: 22px; height: 22px; border-radius: 50%;
      background: #fff;
      display: flex; align-items: center; justify-content: center;
      transition: transform 0.3s cubic-bezier(.4,0,.2,1), background 0.3s;
      flex-shrink: 0;
      box-shadow: 0 1px 4px rgba(0,0,0,.25);
    }
    .theme-btn.light .theme-btn-thumb { transform: translateX(28px); background: #1e1e2e; }
    .theme-btn-icon { position: absolute; display: flex; align-items: center; justify-content: center; }
    .theme-btn-icon.moon { left: 7px; }
    .theme-btn-icon.sun  { right: 6px; }
    @media (max-width: 768px) { .topbar { padding: 0 16px; } }
  `],
  template: `
    <div class="topbar">
      <div class="page-title">{{ pageTitle }}</div>
      <div class="topbar-right">
        <div class="time-block">
          <div class="time-dot" [class.danger]="deadlinePassed" [class.warn]="!deadlinePassed"></div>
          {{ currentTime }}
          @if (deadlinePassed) {
            <span style="color:var(--red);font-size:11px;font-weight:600">Prazo encerrado</span>
          }
        </div>

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
    </div>
  `
})
export class TopbarComponent implements OnInit, OnDestroy {
  theme = inject(ThemeService);

  pageTitle = '';
  currentTime = '';
  deadlinePassed = false;

  private timer?: ReturnType<typeof setInterval>;
  private routerSub?: Subscription;

  private readonly titles: Record<string, string> = {
    '/form':             'Nova Solicitação',
    '/panel':            'Painel de Solicitações',
    '/dashboard':        'Dashboard',
    '/password-request': 'Trocar Senha',
    '/admin-passwords':  'Gestão de Senhas',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.updateTime();
    this.timer = setInterval(() => this.updateTime(), 10000);

    this.routerSub = this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.pageTitle = this.titles[e.urlAfterRedirects] ?? '';
    });

    const url = this.router.url;
    this.pageTitle = this.titles[url.split('?')[0]] ?? '';
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    this.routerSub?.unsubscribe();
  }

  private updateTime(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    this.deadlinePassed = now.getHours() >= 14;
  }
}

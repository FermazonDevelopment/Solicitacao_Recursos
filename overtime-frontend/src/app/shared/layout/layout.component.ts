import { Component, inject, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subscription, filter } from 'rxjs';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastComponent } from '../toast/toast.component';
import { SidebarService } from '../../core/services/sidebar.service';

const TITLES: Record<string, string> = {
  '/form':             'Nova Solicitação',
  '/panel':            'Painel de Solicitações',
  '/dashboard':        'Dashboard',
  '/password-request': 'Trocar Senha',
  '/admin-passwords':  'Gestão de Senhas',
  '/admin-users':      'Gerenciar Usuários',
};

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent, MatIconModule],
  styles: [`
    .main {
      min-height: 100vh; padding-top: var(--altura-topo);
      margin-left: 240px; min-width: 0;
      transition: margin-left .25s cubic-bezier(.4,0,.2,1);
    }
    .main.collapsed { margin-left: 64px; }
    .page-head { padding: 22px 32px 0; }
    @media (max-width: 768px) {
      .main, .main.collapsed { margin-left: 0; }
      .page-head { padding: 16px 16px 0; }
    }
  `],
  template: `
    <app-topbar />
    <app-sidebar />
    <main class="main" [class.collapsed]="sidebarSvc.collapsed()">
      @if (title) {
        <div class="page-head">
          <nav class="page-trail" aria-label="Você está em">
            <span>Solicitação de Recursos</span>
            <mat-icon class="icon-xs">chevron_right</mat-icon>
            <span aria-current="page">{{ title }}</span>
          </nav>
          <h1 class="page-title-h1">{{ title }}</h1>
        </div>
      }
      <router-outlet />
    </main>
    <app-toast />
  `
})
export class LayoutComponent implements OnDestroy {
  sidebarSvc = inject(SidebarService);
  private router = inject(Router);

  title = TITLES[this.router.url.split('?')[0]] ?? '';

  private sub: Subscription = this.router.events
    .pipe(filter(e => e instanceof NavigationEnd))
    .subscribe(e => this.title = TITLES[(e as NavigationEnd).urlAfterRedirects.split('?')[0]] ?? '');

  ngOnDestroy(): void { this.sub.unsubscribe(); }
}

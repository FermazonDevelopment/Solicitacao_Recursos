import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  styles: [`
    .sidebar {
      background: var(--card);
      border-right: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0; left: 0;
      height: 100vh;
      z-index: 100;
      width: 240px;
      transition: width 0.25s cubic-bezier(.4,0,.2,1);
      overflow: hidden;
    }
    .sidebar.collapsed { width: 64px; }

    /* Logo */
    .logo {
      height: 64px;
      padding: 0 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      overflow: hidden;
    }
    .logo-wrap { display: flex; align-items: center; gap: 10px; min-width: 0; }
    .logo-text { overflow: hidden; transition: opacity 0.2s, width 0.25s; white-space: nowrap; }
    .collapsed .logo-text { opacity: 0; width: 0; }
    .logo-title { font-size: 18px; font-weight: 700; letter-spacing: -0.5px; }
    .logo-sub { font-size: 11px; color: var(--t3); margin-top: 2px; text-transform: uppercase; letter-spacing: 1px; }

    /* Toggle button */
    .toggle-btn {
      display: flex; align-items: center; justify-content: center;
      width: 28px; height: 28px; border-radius: var(--rxs);
      border: 1px solid var(--border); background: var(--elevated);
      cursor: pointer; color: var(--t2); flex-shrink: 0;
      transition: all 0.15s;
    }
    .toggle-btn:hover { color: var(--primary); border-color: var(--primary); background: var(--primary-dim); }
    .toggle-btn mat-icon { transition: transform 0.25s cubic-bezier(.4,0,.2,1); }
    .collapsed .toggle-btn mat-icon { transform: rotate(180deg); }

    /* Nav */
    .nav-section { padding: 16px 8px 0; flex: 1; overflow-y: auto; overflow-x: hidden; }
    .nav-label {
      font-size: 10px; color: var(--t3); text-transform: uppercase;
      letter-spacing: 1px; padding: 0 8px; margin: 16px 0 6px;
      white-space: nowrap; overflow: hidden;
      transition: opacity 0.2s;
    }
    .collapsed .nav-label { opacity: 0; }

    .nav-item {
      display: flex; align-items: center; gap: 10px;
      padding: 10px 12px; border-radius: var(--rs);
      cursor: pointer; color: var(--t2); font-size: 14px; font-weight: 500;
      transition: background 0.15s, color 0.15s;
      text-decoration: none; white-space: nowrap; overflow: hidden;
      position: relative;
    }
    .nav-item:hover { background: var(--elevated); color: var(--t1); }
    .nav-item.active { background: var(--primary-dim); color: var(--primary); }

    .nav-item mat-icon { flex-shrink: 0; }
    .nav-text { overflow: hidden; transition: opacity 0.2s, width 0.25s; }
    .collapsed .nav-text { opacity: 0; width: 0; }

    /* Tooltip when collapsed */
    .nav-item[data-tip]:hover::after {
      content: attr(data-tip);
      position: absolute;
      left: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
      background: var(--t1);
      color: var(--card);
      font-size: 12px;
      font-weight: 500;
      padding: 5px 10px;
      border-radius: var(--rxs);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      animation: tipFadeIn 0.15s 0.3s forwards;
      z-index: 200;
    }
    @keyframes tipFadeIn { to { opacity: 1; } }

    /* Footer */
    .sidebar-footer { padding: 12px 8px; border-top: 1px solid var(--border); overflow: hidden; }
    .dept-badge {
      display: flex; align-items: center; gap: 6px;
      padding: 6px 12px; background: var(--primary-dim);
      border-radius: var(--rxs); font-size: 12px; color: var(--primary);
      font-weight: 600; margin-bottom: 6px; white-space: nowrap;
      overflow: hidden;
    }
    .dept-text { overflow: hidden; transition: opacity 0.2s, width 0.25s; }
    .collapsed .dept-text { opacity: 0; width: 0; }

    .logout-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 8px 12px; border-radius: var(--rs);
      cursor: pointer; color: var(--t3); font-size: 13px;
      border: none; background: none; width: 100%;
      transition: all 0.15s; white-space: nowrap; overflow: hidden;
    }
    .logout-btn:hover { color: var(--red); background: var(--red-dim); }
    .logout-text { overflow: hidden; transition: opacity 0.2s, width 0.25s; }
    .collapsed .logout-text { opacity: 0; width: 0; }

    @media (max-width: 768px) { .sidebar { display: none; } }
  `],
  template: `
    <div class="sidebar" [class.collapsed]="sidebarSvc.collapsed()">

      <div class="logo">
        <div class="logo-wrap">
          <mat-icon class="icon-lg" style="color:var(--primary);flex-shrink:0">schedule</mat-icon>
          <div class="logo-text">
            <div class="logo-title">Recursos</div>
            <div class="logo-sub">Horas Extras</div>
          </div>
        </div>
        <button class="toggle-btn" (click)="sidebarSvc.toggle()">
          <mat-icon class="icon-sm">chevron_left</mat-icon>
        </button>
      </div>

      <div class="nav-section">
        <div class="nav-label">Menu</div>

        <a class="nav-item" routerLink="/form" routerLinkActive="active" data-tip="Nova Solicitação">
          <mat-icon>assignment</mat-icon>
          <span class="nav-text">Nova Solicitação</span>
        </a>
        <a class="nav-item" routerLink="/panel" routerLinkActive="active" data-tip="Painel">
          <mat-icon>bar_chart</mat-icon>
          <span class="nav-text">Painel</span>
        </a>
        @if (auth.isAdmin()) {
          <a class="nav-item" routerLink="/dashboard" routerLinkActive="active" data-tip="Dashboard">
            <mat-icon>trending_up</mat-icon>
            <span class="nav-text">Dashboard</span>
          </a>
        }
        @if (auth.isAdmin() || auth.getDepartment() === 'TI') {
          <a class="nav-item" routerLink="/admin-passwords" routerLinkActive="active" data-tip="Gestão de Senhas">
            <mat-icon>manage_accounts</mat-icon>
            <span class="nav-text">Gestão de Senhas</span>
          </a>
        }

        <div class="nav-label" style="margin-top:16px">Conta</div>
        <a class="nav-item" routerLink="/password-request" routerLinkActive="active" data-tip="Trocar Senha">
          <mat-icon>lock_reset</mat-icon>
          <span class="nav-text">Trocar Senha</span>
        </a>
      </div>

      <div class="sidebar-footer">
        <div class="dept-badge">
          <mat-icon class="icon-sm" style="flex-shrink:0">business</mat-icon>
          <span class="dept-text">
            {{ auth.getDepartment() }}
            @if (auth.isAdmin()) { <span class="badge badge-admin">Admin</span> }
          </span>
        </div>
        <button class="logout-btn" (click)="auth.logout()">
          <mat-icon class="icon-sm" style="flex-shrink:0">logout</mat-icon>
          <span class="logout-text">Sair</span>
        </button>
      </div>
    </div>
  `
})
export class SidebarComponent {
  auth       = inject(AuthService);
  sidebarSvc = inject(SidebarService);
}

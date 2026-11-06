import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { SidebarService } from '../../core/services/sidebar.service';

/** Navegação lateral Fermazon: base branca, item ativo com filete e ícone vermelhos. */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  styles: [`
    .sidebar {
      position: fixed; left: 0; top: var(--altura-topo); bottom: 0; z-index: 100;
      width: 240px; background: var(--card); border-right: 1px solid var(--border);
      display: flex; flex-direction: column; overflow: hidden;
      transition: width .25s cubic-bezier(.4,0,.2,1), transform .25s cubic-bezier(.4,0,.2,1);
    }
    .sidebar.collapsed { width: 64px; }

    .nav-section { padding: 12px 10px 0; flex: 1; overflow-y: auto; overflow-x: hidden; }
    .nav-label {
      font-size: 10.5px; font-weight: 700; color: var(--t3);
      text-transform: uppercase; letter-spacing: .08em;
      padding: 0 10px; margin: 18px 0 6px; white-space: nowrap; overflow: hidden;
      transition: opacity .2s;
    }
    .nav-label:first-child { margin-top: 6px; }
    /* Recolhida: o rótulo da seção vira um traço divisor */
    .collapsed .nav-label {
      height: 1px; margin: 12px 10px; padding: 0;
      font-size: 0; color: transparent; background: var(--border);
    }
    .collapsed .nav-label:first-child { height: 0; margin: 4px 0; background: none; }

    .nav-item {
      position: relative; display: flex; align-items: center; gap: 12px;
      height: 42px; padding: 0 12px; margin-bottom: 2px; border-radius: 8px;
      color: var(--t2); font-size: 14px; font-weight: 500; text-decoration: none;
      white-space: nowrap; overflow: hidden; cursor: pointer;
      transition: background 160ms ease, color 160ms ease;
    }
    .nav-item mat-icon { flex-shrink: 0; font-size: 20px; width: 20px; height: 20px; line-height: 20px; color: var(--t3); transition: color 160ms ease; }
    .nav-item:hover { background: var(--elevated); color: var(--heading); }
    .nav-item:hover mat-icon { color: var(--primary); }
    .nav-item.active { background: var(--primary-dim); color: var(--heading); font-weight: 600; }
    .nav-item.active mat-icon { color: var(--fz-vermelho); }
    .nav-item.active::before {
      content: ''; position: absolute; left: 0; top: 8px; bottom: 8px; width: 3px;
      border-radius: 0 3px 3px 0; background: var(--fz-vermelho);
    }
    .nav-item:focus-visible { outline: none; box-shadow: var(--foco); }
    .nav-text { overflow: hidden; transition: opacity .2s; }
    .collapsed .nav-text { opacity: 0; }

    /* Dica quando recolhida */
    .collapsed .nav-item[data-tip]:hover::after {
      content: attr(data-tip); position: fixed; left: 72px;
      background: var(--fz-marinho); color: #fff; font-size: 12px; font-weight: 600;
      padding: 6px 10px; border-radius: 6px; white-space: nowrap; pointer-events: none;
      box-shadow: var(--sombra-2); z-index: 200;
    }

    .sidebar-footer { padding: 10px; border-top: 1px solid var(--border); }
    .toggle-btn {
      display: flex; align-items: center; gap: 12px; width: 100%; height: 38px; padding: 0 12px;
      border: none; border-radius: 8px; background: transparent; cursor: pointer;
      color: var(--t2); font-size: 13px; white-space: nowrap; overflow: hidden;
      transition: background 160ms ease, color 160ms ease;
    }
    .toggle-btn:hover { background: var(--elevated); color: var(--heading); }
    .toggle-btn mat-icon { flex-shrink: 0; transition: transform .25s cubic-bezier(.4,0,.2,1); }
    .collapsed .toggle-btn mat-icon { transform: rotate(180deg); }

    .backdrop { display: none; }

    @media (max-width: 768px) {
      .sidebar, .sidebar.collapsed { width: 260px; transform: translateX(-100%); z-index: 130; }
      .sidebar.open { transform: none; box-shadow: var(--sombra-modal); }
      .collapsed .nav-text { opacity: 1; }
      /* no celular a gaveta é sempre larga: volta a mostrar os rótulos */
      .collapsed .nav-label {
        height: auto; margin: 18px 0 6px; padding: 0 10px;
        font-size: 10.5px; color: var(--t3); background: none;
      }
      .collapsed .nav-label:first-child { margin-top: 6px; }
      .sidebar-footer { display: none; }
      .backdrop.open {
        display: block; position: fixed; inset: var(--altura-topo) 0 0 0; z-index: 125;
        background: rgba(10,25,46,.5);
      }
    }
  `],
  template: `
    <div class="backdrop" [class.open]="sidebarSvc.mobileOpen()" (click)="sidebarSvc.closeMobile()"></div>
    <nav class="sidebar" aria-label="Navegação principal"
         [class.collapsed]="sidebarSvc.collapsed()" [class.open]="sidebarSvc.mobileOpen()">
      <div class="nav-section" (click)="sidebarSvc.closeMobile()">
        <div class="nav-label">Solicitações</div>

        <a class="nav-item" routerLink="/form" routerLinkActive="active" data-tip="Nova Solicitação">
          <mat-icon>assignment_add</mat-icon>
          <span class="nav-text">Nova Solicitação</span>
        </a>
        <a class="nav-item" routerLink="/panel" routerLinkActive="active" data-tip="Painel">
          <mat-icon>table_rows</mat-icon>
          <span class="nav-text">Painel</span>
        </a>
        @if (auth.isAdmin()) {
          <a class="nav-item" routerLink="/dashboard" routerLinkActive="active" data-tip="Dashboard">
            <mat-icon>monitoring</mat-icon>
            <span class="nav-text">Dashboard</span>
          </a>
        }

        @if (auth.getDepartment() === 'TI') {
          <div class="nav-label">Administração</div>
          <a class="nav-item" routerLink="/admin-passwords" routerLinkActive="active" data-tip="Gestão de Senhas">
            <mat-icon>key</mat-icon>
            <span class="nav-text">Gestão de Senhas</span>
          </a>
          <a class="nav-item" routerLink="/admin-users" routerLinkActive="active" data-tip="Gerenciar Usuários">
            <mat-icon>manage_accounts</mat-icon>
            <span class="nav-text">Gerenciar Usuários</span>
          </a>
        }

        <div class="nav-label">Conta</div>
        <a class="nav-item" routerLink="/password-request" routerLinkActive="active" data-tip="Trocar Senha">
          <mat-icon>lock_reset</mat-icon>
          <span class="nav-text">Trocar Senha</span>
        </a>
      </div>

      <div class="sidebar-footer">
        <button type="button" class="toggle-btn" (click)="sidebarSvc.toggle()"
                [attr.aria-label]="sidebarSvc.collapsed() ? 'Expandir menu' : 'Recolher menu'">
          <mat-icon>left_panel_close</mat-icon>
          <span class="nav-text">Recolher menu</span>
        </button>
      </div>
    </nav>
  `
})
export class SidebarComponent {
  auth       = inject(AuthService);
  sidebarSvc = inject(SidebarService);
}

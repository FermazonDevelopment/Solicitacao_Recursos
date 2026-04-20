import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { ToastComponent } from '../toast/toast.component';
import { SidebarService } from '../../core/services/sidebar.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, ToastComponent],
  styles: [`
    .app { display: flex; min-height: 100vh; }
    .main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      margin-left: 240px;
      transition: margin-left 0.25s cubic-bezier(.4,0,.2,1);
    }
    .main.collapsed { margin-left: 64px; }
  `],
  template: `
    <div class="app">
      <app-sidebar />
      <div class="main" [class.collapsed]="sidebarSvc.collapsed()">
        <app-topbar />
        <router-outlet />
      </div>
    </div>
    <app-toast />
  `
})
export class LayoutComponent {
  sidebarSvc = inject(SidebarService);
}

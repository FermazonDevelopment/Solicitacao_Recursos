import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatIconModule],
  styles: [`
    .toast-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 1000; }
    .toast { display: flex; align-items: center; gap: 12px; padding: 14px 18px; background: var(--card); border: 1px solid var(--border); border-radius: var(--r); box-shadow: 0 8px 32px rgba(0,0,0,.4); min-width: 280px; animation: slideIn .3s ease; }
    .toast.success { border-left: 4px solid var(--green); }
    .toast.error   { border-left: 4px solid var(--red); }
    .toast.warning { border-left: 4px solid var(--yellow); }
    .toast-msg { font-size: 13px; font-weight: 500; }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: none; opacity: 1; } }
  `],
  template: `
    <div class="toast-container">
      @for (t of svc.toasts(); track t.id) {
        <div class="toast {{ t.type }}">
          <mat-icon [style.color]="iconColor[t.type]">{{ icons[t.type] }}</mat-icon>
          <span class="toast-msg">{{ t.message }}</span>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  svc = inject(ToastService);
  icons = { success: 'check_circle', error: 'cancel', warning: 'warning' };
  iconColor = { success: 'var(--green)', error: 'var(--red)', warning: 'var(--yellow)' };
}

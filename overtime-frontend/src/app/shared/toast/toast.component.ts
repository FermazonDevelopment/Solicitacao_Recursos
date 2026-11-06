import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [MatIconModule],
  styles: [`
    .toast-container { position: fixed; bottom: 24px; right: 24px; display: flex; flex-direction: column; gap: 8px; z-index: 1100; max-width: calc(100vw - 32px); }
    .toast {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px; min-width: 280px; max-width: 420px;
      background: var(--card); color: var(--t1); border: 1px solid var(--border); border-left: 4px solid var(--primary);
      border-radius: 10px; box-shadow: var(--sombra-modal); animation: slideIn .25s ease;
    }
    .toast.success { border-left-color: var(--green); }
    .toast.error   { border-left-color: var(--red); }
    .toast.warning { border-left-color: var(--yellow); }
    .toast-msg { font-size: 13.5px; font-weight: 500; }
    @keyframes slideIn { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
    @media (max-width: 480px) { .toast-container { left: 16px; right: 16px; bottom: 16px; } .toast { min-width: 0; } }
  `],
  template: `
    <div class="toast-container" role="status" aria-live="polite">
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
  icons = { success: 'check_circle', error: 'error', warning: 'warning' };
  iconColor = { success: 'var(--green)', error: 'var(--red)', warning: 'var(--yellow)' };
}

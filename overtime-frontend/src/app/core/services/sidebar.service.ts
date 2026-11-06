import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SidebarService {
  /** Sidebar recolhida (desktop). */
  collapsed = signal(false);
  /** Sidebar aberta como gaveta (telas pequenas). */
  mobileOpen = signal(false);

  toggle(): void {
    this.collapsed.update(v => !v);
  }

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }
}

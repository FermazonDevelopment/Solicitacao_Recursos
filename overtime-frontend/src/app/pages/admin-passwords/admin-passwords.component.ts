import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { PasswordService } from '../../core/services/password-request.service';
import { ToastService } from '../../shared/toast/toast.service';
import { AuthService } from '../../core/services/auth.service';

interface DeptState {
  open: boolean;
  newPw: string;
  confirm: string;
  showNew: boolean;
  showConfirm: boolean;
  loading: boolean;
}

@Component({
  selector: 'app-admin-passwords',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './admin-passwords.component.html'
})
export class AdminPasswordsComponent implements OnInit {
  private svc   = inject(PasswordService);
  private toast = inject(ToastService);
  private auth  = inject(AuthService);

  departments: string[] = [];
  state: Record<string, DeptState> = {};

  ngOnInit(): void {
    this.svc.getDepartments().subscribe({
      next: depts => {
        const own = this.auth.getDepartment();
        this.departments = depts.filter(d => d !== own);
        this.state = Object.fromEntries(
          this.departments.map(d => [d, { open: false, newPw: '', confirm: '', showNew: false, showConfirm: false, loading: false }])
        );
      },
      error: () => this.toast.show('Erro ao carregar departamentos', 'error')
    });
  }

  toggle(dept: string): void {
    if (this.state[dept]?.open) {
      delete this.state[dept];
    } else {
      this.state[dept] = { open: true, newPw: '', confirm: '', showNew: false, showConfirm: false, loading: false };
    }
  }

  save(dept: string): void {
    const s = this.state[dept];
    if (!s) return;
    if (!s.newPw || s.newPw.length < 4) { this.toast.show('Senha deve ter ao menos 4 caracteres', 'error'); return; }
    if (s.newPw !== s.confirm)           { this.toast.show('As senhas não coincidem', 'error'); return; }

    s.loading = true;
    this.svc.changeDeptPassword(dept, s.newPw).subscribe({
      next: () => {
        this.toast.show(`Senha de ${dept} alterada com sucesso!`);
        delete this.state[dept];
      },
      error: err => {
        this.toast.show(err.error?.error ?? 'Erro ao alterar senha', 'error');
        s.loading = false;
      }
    });
  }

  deptInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
  }
}

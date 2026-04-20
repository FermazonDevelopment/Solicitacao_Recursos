import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { PasswordService } from '../../core/services/password-request.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-password-request',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './password-request.component.html'
})
export class PasswordRequestComponent {
  private auth  = inject(AuthService);
  private svc   = inject(PasswordService);
  private toast = inject(ToastService);

  department  = this.auth.getDepartment();
  current     = '';
  newPw       = '';
  confirm     = '';
  loading     = false;
  showCurrent = false;
  showNew     = false;
  showConfirm = false;

  submit(): void {
    if (!this.current)  { this.toast.show('Informe a senha atual', 'error'); return; }
    if (!this.newPw)    { this.toast.show('Informe a nova senha', 'error'); return; }
    if (this.newPw.length < 4) { this.toast.show('Nova senha deve ter ao menos 4 caracteres', 'error'); return; }
    if (this.newPw !== this.confirm) { this.toast.show('As senhas não coincidem', 'error'); return; }

    this.loading = true;
    this.svc.changeOwn(this.current, this.newPw).subscribe({
      next: () => {
        this.toast.show('Senha alterada com sucesso!');
        this.current = ''; this.newPw = ''; this.confirm = '';
        this.loading = false;
      },
      error: err => {
        this.toast.show(err.error?.error ?? 'Erro ao alterar senha', 'error');
        this.loading = false;
      }
    });
  }
}

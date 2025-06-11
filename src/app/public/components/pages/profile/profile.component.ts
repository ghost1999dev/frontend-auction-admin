import { Component, Input, OnInit } from '@angular/core';
import { Admin, AdminResponse } from 'src/app/core/models/admin';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loading: boolean = true;
  admin: Admin | any;
  adminUpdate: Partial<Admin> | any = {};
  
  // Dialog controls
  profileDialog: boolean = false;
  passwordDialog: boolean = false;
  submitted: boolean = false;
  
  // Password update
  passwordData = {
    currentPassword: '',
    Newpassword: ''
  };
  confirmPassword: string = '';

  constructor(
    private notificationService: NotificationService,
    private adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.loadAdminProfile();
  }

  loadAdminProfile(): void {
    this.loading = true;
    // Assuming we have the admin ID from auth service or similar
    this.adminService.getAdminById(this.id).subscribe({
      next: (response: any) => {
        this.admin = response;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  
  preventNonDigits(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace', 'Delete', 
      'ArrowLeft', 'ArrowRight', 
      'Tab', 'Home', 'End'
    ];

    // Permitir teclas de control
    if (allowedKeys.includes(event.key)) return true;

    // Bloquear si no es un número (0-9)
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  formatPhone(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Permitir borrado completo
  if (value === '+(503) ') {
    this.adminUpdate.phone = '';
    return;
  }

  // Eliminar todo excepto dígitos (incluyendo el "+" inicial si existe)
  let digits = value.replace(/[^\d]/g, '');

  // Si no hay dígitos, limpiar el campo
  if (digits === '') {
    this.adminUpdate.phone = '';
    return;
  }

  // Forzar el código de país 503
  if (!digits.startsWith('503')) {
    digits = '503' + digits; // Agregar 503 si no está presente
  }

  // Limitar a 8 dígitos después del 503 (máximo permitido: 50312345678 → se convierte en 50312345678)
  digits = digits.substring(0, 11); // 503 + 8 dígitos = 11 caracteres máx.

  // Formatear como +(503) 1234-5678
  let formattedValue = `+(${digits.substring(0, 3)}) `;
  if (digits.length > 3) {
    formattedValue += digits.substring(3, 7);
  }
  if (digits.length > 7) {
    formattedValue += `-${digits.substring(7, 11)}`;
  }

  // Actualizar el valor en el modelo y el input
  this.adminUpdate.phone = formattedValue;
  input.value = formattedValue;

  // Mover el cursor al final
  setTimeout(() => {
    input.setSelectionRange(formattedValue.length, formattedValue.length);
  });
}

  showEditDialog(): void {
    this.adminUpdate = { ...this.admin };
    this.profileDialog = true;
  }

  showPasswordDialog(): void {
    this.passwordData = { currentPassword: '', Newpassword: '' };
    this.confirmPassword = '';
    this.passwordDialog = true;
  }

  updateProfile(): void {
    this.submitted = true;
    
    if (!this.adminUpdate.full_name || !this.adminUpdate.email) {
      return;
    }

    this.loading = true;
    const adminId = this.admin.id;
    
    this.adminService.updateAdmin(adminId, this.adminUpdate).subscribe({
      next: (response) => {
        this.notificationService.showSuccessCustom('Perfil actualizado exitosamente');
        this.loadAdminProfile();
        this.profileDialog = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  hideDialog(): void {
    this.profileDialog = false;
    this.passwordDialog = false;
    this.submitted = false;
  }

    getUserInfo() {
    const token = this.getTokens();
    let payload;
    if (token) {
      payload = token.split(".")[1];
      payload = window.atob(payload);
      return JSON.parse(payload)['id'];
    } else {
      return null;
    }
  }
  
  getTokens() {
    return localStorage.getItem("admin_token");
  }

  id: any = this.getUserInfo();
}

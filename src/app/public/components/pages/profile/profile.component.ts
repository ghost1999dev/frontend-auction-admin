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
      error: (error) => {
        this.notificationService.showErrorCustom('No se pudo cargar el perfil de administrador');
        this.loading = false;
      }
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
      error: (error) => {
        this.notificationService.showErrorCustom(error.error?.message || 'No se pudo actualizar el perfil');
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

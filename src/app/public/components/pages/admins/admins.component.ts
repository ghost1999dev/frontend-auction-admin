import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Admin } from 'src/app/core/models/admin';
import { AdminService } from 'src/app/core/services/admin.service';
import { forkJoin, Subscription } from 'rxjs';
import { NotificationService } from 'src/app/core/services/notification.service';
import { AdminStateService } from 'src/app/core/services/admin-state.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrl: './admins.component.scss'
})
export class AdminsComponent implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  
  admins: Admin[] = [];
  selectedAdmins: Admin[] = [];
  admin: Admin = {} as Admin;
  private subscriptions = new Subscription();

  showAddEditDialog = false;
  currentAdminId?: number;

  adminDialog: boolean = false;
  deleteAdminDialog: boolean = false;
  deleteAdminsDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  statuses = [
    { label: 'Activo', value: 'Activo' },
    { label: 'Inactivo', value: 'Inactivo' }
  ];

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private adminStateService: AdminStateService
  ) { }

 ngOnInit(): void {
    this.loadAdmins();
    
    // Suscríbete a los cambios
    this.subscriptions.add(
      this.adminService.adminsChanged$.subscribe(() => {
        this.loadAdmins();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadAdmins(): void {
      this.loading = true;
      this.adminService.getAllAdmins().subscribe({
          next: (admins: any) => {
              // Filtrar el administrador actual (excluirlo de la lista)
              this.admins = admins.filter((admin: Admin) => admin.id !== this.id);
              this.loading = false;
          },
          error: () => {
              this.loading = false;
          }
      });
  }

  deleteAdmin(admin: Admin): void {
    this.admin = { ...admin };
    this.deleteAdminDialog = true;
  }

  confirmDelete() {
    this.adminService.deleteAdmin(this.admin.id).subscribe({
      next: () => {
        this.adminStateService.removeAdmin(this.admin.id);
        this.deleteAdminDialog = false;
        this.admin = {} as Admin;
        this.notificationService.showSuccessCustom('Administrador eliminado');
      },
      error: () => {
        this.deleteAdminDialog = false;
      }
    });
  }

  confirmDeleteSelected(): void {
    this.deleteAdminsDialog = false;
    if (!this.selectedAdmins || this.selectedAdmins.length === 0) {
      this.notificationService.showErrorCustom('No hay administradores seleccionados');
      return;
    }

    const deleteOperations = this.selectedAdmins.map(admin => 
      this.adminService.deleteAdmin(admin.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.selectedAdmins.forEach(admin => {
          this.adminStateService.removeAdmin(admin.id);
        });
        this.notificationService.showSuccessCustom(`${this.selectedAdmins.length} Administradores eliminados`);
        this.selectedAdmins = [];
      }
    });
  }

  hideDialog(): void {
    this.submitted = false;
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  openNew(): void {
    this.currentAdminId = undefined;
    this.showAddEditDialog = true;
  }

  editAdmin(admin: Admin): void {
    this.admin = { ...admin };
    this.currentAdminId = admin.id;
    this.showAddEditDialog = true;
  }

  onAdminSaved(): void {
      this.showAddEditDialog = false;
      this.loadAdmins();
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


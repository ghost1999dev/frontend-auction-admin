import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Admin } from 'src/app/core/models/admin';
import { AdminService } from 'src/app/core/services/admin.service';
import { forkJoin } from 'rxjs';

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

  // In admin-list.component.ts
  showAddEditDialog = false;
  currentAdminId?: number;

  adminDialog: boolean = false;
  deleteAdminDialog: boolean = false;
  deleteAdminsDialog: boolean = false;

  submitted: boolean = false;
  loading: boolean = false;

  statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' }
  ];

  constructor(
    private adminService: AdminService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadAdmins();
  }

  loadAdmins(): void {
    this.loading = true;
    this.adminService.getAllAdmins().subscribe({
      next: (response: any) => {
        this.admins = response;
        this.loading = false;
      },
      error: (error) => {
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
        
        this.loadAdmins();
        this.deleteAdminDialog = false;
        this.admin = {} as Admin;
      },
      error: (error) => {
      }
    });
  }

  confirmDeleteSelected(): void {
    this.deleteAdminsDialog = false;
    if (!this.selectedAdmins || this.selectedAdmins.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No admins selected'
      });
      return;
    }

    const deleteOperations = this.selectedAdmins.map(admin => 
      this.adminService.deleteAdmin(admin.id)
    );

    forkJoin(deleteOperations).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `${this.selectedAdmins.length} admins deleted`
        });
        this.loadAdmins();
        this.selectedAdmins = [];
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete some admins'
        });
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
    console.log('Opening dialog...');  // Check if this fires
    this.currentAdminId = undefined;
    this.showAddEditDialog = true;
    console.log('showAddEditDialog:', this.showAddEditDialog);  // Should be true
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
}


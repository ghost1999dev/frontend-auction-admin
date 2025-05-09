import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { AdminUpdateRequest, AdminCreateRequest } from 'src/app/core/models/admin';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-add-edit-admins',
  templateUrl: './add-edit-admins.component.html',
  styleUrl: './add-edit-admins.component.scss'
})
export class AddEditAdminsComponent implements OnInit {

  @Input() adminId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  adminForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private messageService: MessageService
  ) {
    this.adminForm = this.fb.group({
      full_name: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', this.adminId ? null : Validators.required],
      image: [''],
      status: ['active']
    });
  }

  ngOnInit(): void {
    if (this.adminId) {
      this.loadAdmin(this.adminId);
    }
  }

  loadAdmin(id: number): void {
    this.loading = true;
    this.adminService.getAdminById(id).subscribe({
      next: (admin: any) => {
        this.adminForm.patchValue({
          full_name: admin.full_name,
          phone: admin.phone,
          email: admin.email,
          username: admin.username,
          image: admin.image,
          status: admin.status
        });
        this.adminForm.get('password')?.clearValidators();
        this.adminForm.get('password')?.updateValueAndValidity();
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load admin'
        });
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.adminForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.adminForm.value;

    if (this.adminId) {
      // Update admin
      this.adminService.updateAdmin(this.adminId, formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin updated successfully'
          });
          this.saved.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update admin'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Create admin
      this.adminService.createAdmin(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin created successfully'
          });
          this.saved.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create admin'
          });
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get f() { return this.adminForm.controls; }
  
}

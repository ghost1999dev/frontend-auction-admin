import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminUpdateRequest, AdminCreateRequest } from 'src/app/core/models/admin';
import { AdminService } from 'src/app/core/services/admin.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-add-edit-admins',
  templateUrl: './add-edit-admins.component.html',
  styleUrl: './add-edit-admins.component.scss'
})
export class AddEditAdminsComponent implements OnInit {

  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  @Input() adminId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  public roles: any =  [
    { name: 'Admin', id: 'Administrador' },
    { name: 'SuperAdmin', id: 'SuperAdministrador' }
  ];

  adminForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService,
  ) {
    this.adminForm = this.fb.group({
      full_name: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      //username: ['', Validators.required],
      password: ['', this.adminId ? null : Validators.required],
      image: [''],
      role: [''],
      //status: ['active']
    });
  }

  ngOnInit(): void {
    if (this.adminId) {
      this.loadAdmin(this.adminId);
    }
  }

  
  formatPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    
    // Permitir borrado completo
    if (value.length === 0) {
      this.adminForm.get('phone')?.setValue('', { emitEvent: false });
      return;
    }
    
    // Asegurar que el código de país sea 503
    const countryCode = '503';
    let mainNumber = value;
    
    // Si el valor comienza con 503, lo usamos
    if (value.startsWith('503')) {
      mainNumber = value.substring(3);
    }
    // Si no, asumimos que es parte del número principal
    
    let formattedValue = `+(${countryCode})`;
    
    if (mainNumber.length > 0) {
      formattedValue += ` ${mainNumber.substring(0, 4)}`;
      if (mainNumber.length > 4) {
        formattedValue += `-${mainNumber.substring(4, 8)}`;
      }
    }

    this.adminForm.get('phone')?.setValue(formattedValue, { emitEvent: false });
    
    // Manejo básico del cursor
    setTimeout(() => {
      const newCursorPosition = formattedValue.length;
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    });
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
        this.notificationService.showErrorCustom(error.error?.message || 'No se pudo cargar el administrador');
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
          this.notificationService.showSuccessCustom('Administrador actualizado exitosamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'No se pudo actualizar el administrador');
          this.loading = false;
        },
        complete: () => {
          this.loading = false;
        }
      });
    } else {
      // Create admin
      console.log(this.adminForm.value)
      this.adminService.createAdmin(formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Administrador creado exitosamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'No se pudo crear el administrador');
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

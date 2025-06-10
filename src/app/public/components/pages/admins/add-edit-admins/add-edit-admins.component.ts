import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AdminUpdateRequest, AdminCreateRequest } from 'src/app/core/models/admin';
import { AdminStateService } from 'src/app/core/services/admin-state.service';
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

  public roles = [
    { name: 'Admin', id: 3 },
    { name: 'SuperAdmin', id: 4 }
  ];

  adminForm: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private notificationService: NotificationService,
    private adminStateService: AdminStateService
  ) {
    this.adminForm = this.fb.group({
      full_name: ['', Validators.required],
      phone: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      image: [''],
      role: ['', Validators.required], // Añadido Validators.required
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
        // Verifica primero qué valor viene para el rol
        const roleValue = this.determineRoleValue(admin);
        
        this.adminForm.patchValue({
          full_name: admin.full_name,
          phone: admin.phone,
          email: admin.email,
          password: admin.password,
          username: admin.username,
          image: admin.image,
          role: roleValue, // Usa el valor determinado
          status: admin.status
        });
        this.loading = false;
      }
    });
  }

  // Método para determinar el valor correcto del rol
  private determineRoleValue(admin: any): string {
    // Primero verifica si viene role_id y coincide con tus opciones
    if (admin.role_id && this.roles.some(r => r.id === admin.role_id)) {
      return admin.role_id;
    }
    
    // Si no, verifica si viene role
    if (admin.role && this.roles.some(r => r.id === admin.role)) {
      return admin.role;
    }
    
    // Si no coincide con nada, devuelve vacío o un valor por defecto
    return '';
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



  onSubmit(): void {
    this.submitted = true;

    if (this.adminForm.invalid) {
      return;
    }

    this.loading = true;

    if (this.adminId) {
      // Update admin
      const updateData: any = {
        full_name: this.adminForm.get('full_name')?.value,
        email: this.adminForm.get('email')?.value,
        //phone: this.adminForm.get('phone')?.value,
        status: this.adminForm.get('status')?.value,
      }
      
      this.adminService.updateAdmin(this.adminId, updateData).subscribe({
        next: (updatedAdmin: any) => {
          this.adminService.notifyAdminsChanged(); // Notifica el cambio
          this.notificationService.showSuccessCustom('Administrador actualizado exitosamente');
          this.saved.emit();
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      // Create admin
      const createData: any = {
        full_name: this.adminForm.get('full_name')?.value,
        phone: this.adminForm.get('phone')?.value,
        email: this.adminForm.get('email')?.value,
        password: this.adminForm.get('password')?.value,
        role: this.adminForm.get('role')?.value,
      }

      this.adminService.createAdmin(createData).subscribe({
        next: (newAdmin: any) => {
          this.adminService.notifyAdminsChanged(); // Notifica el cambio
          this.notificationService.showSuccessCustom('Administrador creado exitosamente');
          this.saved.emit();
        },
        error: () => {
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

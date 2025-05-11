// add-edit-users.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ROLES } from 'src/app/core/models/role';
import { usersWithImage } from 'src/app/core/models/users';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-add-edit-users',
  templateUrl: './add-edit-users.component.html',
  styleUrls: ['./add-edit-users.component.scss'],
})
export class AddEditUsersComponent implements OnInit {

  @Input() userId?: number;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  roles = ROLES;
  selectedRole!: number; // This will store the selected role ID

  userForm: FormGroup;
  loading = false;
  submitted = false;
  emailVerified = false;
  verificationCodeSent = false;
  verificationCode = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      image: [''],
      password: ['', this.userId ? null : [Validators.required, Validators.minLength(6)]],
      role_id: [null, Validators.required],
      account_type: [1, Validators.required],
      code: ['']
    });
  }

  ngOnInit(): void {
    if (this.userId) {
      this.loadUser(this.userId);
    }
  }

  loadUser(id: number): void {
    this.loading = true;
    this.userService.getUserById(id).subscribe({
      next: (response: any) => {
        const user = response;
        this.userForm.patchValue({
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          image: user.image,
          role_id: user.role_id,
          account_type: 1
        });
        this.userForm.get('password')?.clearValidators();
        this.userForm.get('password')?.updateValueAndValidity();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom(error.error?.message || 'No se pudo cargar el usuario');
        this.loading = false;
      }
    });
  }

  verifyEmail(): void {
    const email = this.userForm.get('email')?.value;
    if (!email) return;

    this.loading = true;
    this.userService.verifyEmail({ email }).subscribe({
      next: (response) => {
        this.verificationCodeSent = true;
        this.notificationService.showSuccessCustom('Código de verificación enviado al correo electrónico');
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.showErrorCustom(error.error?.message || 'No se pudo enviar el código de verificación');
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;
    const formData = this.userForm.value;

    if (this.userId) {
      // Update user
      const updateData = {
        name: formData.name,
        address: formData.address,
        phone: formData.phone
      };

      this.userService.updateUser(this.userId, updateData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('No se pudo actualizar el usuario');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'No se pudo actualizar el usuario');
          this.loading = false;
        }
      });
    } else {
      // Create user
      if (!this.verificationCode) {
        this.notificationService.showErrorCustom('Por favor, verifique su correo electrónico primero');
        this.loading = false;
        return;
      }

      formData.code = this.verificationCode;
      formData.password = this.userForm.get('password')?.value;

      this.userService.createUser(formData).subscribe({
        next: () => {
          this.notificationService.showSuccessCustom('Usuario creado exitosamente');
          this.saved.emit();
        },
        error: (error) => {
          this.notificationService.showErrorCustom(error.error?.message || 'Error al crear el usuario');
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  get f() { return this.userForm.controls; }
}
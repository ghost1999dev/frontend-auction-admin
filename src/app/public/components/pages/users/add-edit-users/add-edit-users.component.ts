// add-edit-users.component.ts
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ROLES } from 'src/app/core/models/role';
import { usersWithImage } from 'src/app/core/models/users';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-add-edit-users',
  templateUrl: './add-edit-users.component.html',
  styleUrls: ['./add-edit-users.component.scss'],
  providers: [MessageService]
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
    private messageService: MessageService
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
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load user'
        });
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
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Verification code sent to email'
        });
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to send verification code'
        });
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
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully'
          });
          this.saved.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to update user'
          });
          this.loading = false;
        }
      });
    } else {
      // Create user
      if (!this.verificationCode) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please verify your email first'
        });
        this.loading = false;
        return;
      }

      formData.code = this.verificationCode;
      formData.password = this.userForm.get('password')?.value;

      this.userService.createUser(formData).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User created successfully'
          });
          this.saved.emit();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create user'
          });
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
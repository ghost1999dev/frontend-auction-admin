import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import { NotificationService } from 'src/app/core/services/notification.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  forgotForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    public AdminSrv: AdminService,
    public layoutService: LayoutService,
    private router: Router,
    private notificationService: NotificationService,
  ) {

    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      url_base: [''],
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      return;
    }

    const base_url: any = window.location.origin + '/#/auth/reset-password'+'?email='+this.forgotForm.get('email')?.value+'&token='
    this.forgotForm.get('url_base')?.setValue(base_url);

    this.loading = true;
    const email = this.forgotForm.get('email')?.value;
    const url_base = this.forgotForm.get('url_base')?.value;

    this.AdminSrv.forgotPassword(email, url_base)
      .subscribe({
        next: (response) => {
          this.loading = false;
          this.notificationService.showSuccessCustom('Email, Enviado a su Correo');
          // Navigate to reset password with email as query param
          this.router.navigate(['/auth/reset-password'], { 
            queryParams: { email } 
          });
        },
        error: (error) => {
          this.loading = false;
        }
      });
  }
}
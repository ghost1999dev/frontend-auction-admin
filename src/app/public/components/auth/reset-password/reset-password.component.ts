import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import { CustomValidators } from 'src/app/core/validators/CustomValidators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  loading = false;
  email: string = '';
  token: string = '';

  passwordChecks = {
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    public AdminSrv: AdminService,
    public layoutService: LayoutService,
  ) {
    this.resetForm = this.fb.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8), CustomValidators.passwordStrength]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
      this.token = params['token'];
    });
  }

  updatePasswordChecks() {
    const value = this.resetForm.get('password')?.value || '';
    
    this.passwordChecks = {
      length: value.length >= 8,
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#$%^&*]/.test(value)
    };
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value 
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    this.loading = true;
    const { code, password } = this.resetForm.value;

    this.AdminSrv.resetPassword( 
      this.email, 
      code,
      password,
      this.token
    ).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.loading = false;
      }
    });
  }
}
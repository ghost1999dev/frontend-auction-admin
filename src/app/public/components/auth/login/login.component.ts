import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { AdminLoginRequest } from 'src/app/core/models/admin';
import { AdminLoginService } from 'src/app/core/services/adminLogin.service';
import { LayoutService } from 'src/app/core/services/layout.service';
import { NotificationService } from 'src/app/core/services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$";
  loginForm!: FormGroup;
  submitted: boolean = false;
  loading = false;
  
  constructor(
    public layoutService: LayoutService,
    private fb: FormBuilder,
    private adminLoginService: AdminLoginService,
    private router: Router,
    private notificationService: NotificationService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials: AdminLoginRequest = this.loginForm.value;

    this.adminLoginService.loginAdmin(credentials).subscribe({
      next: () => {
        this.notificationService.showSuccessCustom('Inicio de sesión exitoso');
        this.router.navigate(['/main/dashboard']);
      },
      error: (error: any) => {
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  onLoggedin() {
    localStorage.setItem('isLoggedin', 'true');
  }

}
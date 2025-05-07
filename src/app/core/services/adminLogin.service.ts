import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NotificationService } from './notification.service';
import { AdminProfile, AdminLoginRequest, AdminLoginResponse } from '../models/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminLoginService {

  private apiUrl = `${environment.server_url}auth`;
  private currentAdminSubject = new BehaviorSubject<AdminProfile | null>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private notificationService: NotificationService
  ) {
    this.loadCurrentAdmin();
  }

  // Admin Login
  loginAdmin(credentials: AdminLoginRequest): Observable<AdminLoginResponse> {
    return this.http.post<AdminLoginResponse>(`${this.apiUrl}/Adminlogin`, credentials).pipe(
      tap(response => {
        this.storeToken(response.token);
        this.decodeAndSetAdmin(response.token);
      })
    );
  }

  // Check if admin is logged in
  isAdminLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.jwtHelper.isTokenExpired(token);
  }

  // Get current admin profile
  getCurrentAdmin(): AdminProfile | null {
    return this.currentAdminSubject.value;
  }

  // Logout
  logoutAdmin(): void {
    localStorage.removeItem('admin_token');
    this.currentAdminSubject.next(null);
    this.router.navigate(['/admin/login']);
    this.notificationService.showSuccessCustom('Logged out successfully');
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  // Private methods
  private storeToken(token: string): void {
    localStorage.setItem('admin_token', token);
    localStorage.setItem('isLoggedin', 'true');
  }

  private decodeAndSetAdmin(token: string): void {
    const decodedToken = this.jwtHelper.decodeToken(token);
    const adminProfile: AdminProfile = {
      id: decodedToken.id,
      full_name: decodedToken.full_name,
      email: decodedToken.email,
      username: decodedToken.username,
      status: decodedToken.status
    };
    this.currentAdminSubject.next(adminProfile);
  }

  private loadCurrentAdmin(): void {
    const token = this.getToken();
    if (token && !this.jwtHelper.isTokenExpired(token)) {
      this.decodeAndSetAdmin(token);
    }
  }
}
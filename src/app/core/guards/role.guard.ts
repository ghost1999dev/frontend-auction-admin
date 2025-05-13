// src/app/core/guards/role.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AdminService } from '../services/admin.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private adminServices: AdminService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    
    // Ahora esperamos un array de roles permitidos
    const allowedRoles = next.data['allowedRoles'] as number[];
    const token = this.getToken();
    
    if (!token) {
      this.router.navigate(['/auth/login']);
      return of(false);
    }

    const adminId = this.getUserIdFromToken(token);
    return this.adminServices.getAdminById(adminId)
    .pipe(
      map((admin: any) => {
        if (admin && allowedRoles.includes(admin.role_id)) {
          return true;
        } else {
          this.router.navigate(['/error/main']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/auth/login']);
        return of(false);
      })
    );
  }

  private getToken(): string | null {
    return localStorage.getItem("admin_token");
  }

  private getUserIdFromToken(token: string): number {
    const payload = token.split(".")[1];
    const decodedPayload = window.atob(payload);
    return JSON.parse(decodedPayload)['id'];
  }
}
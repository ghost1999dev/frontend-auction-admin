import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { 
  AdminCreateRequest, 
  AdminResponse, 
  AdminUpdateRequest, 
  ProjectStatusUpdate 
} from '../models/admin';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.server_url}admins`;
  private adminsCache: Observable<any> | null = null;
  private adminCache = new Map<number, Observable<any>>();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) { }

  // Admin CRUD Operations
  createAdmin(adminData: AdminCreateRequest): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.apiUrl}/create`, adminData).pipe(
      map(response => response.data),
      catchError(err => this.handlerError(err))
    );
  }

  getAllAdmins(): Observable<AdminResponse> {
    if (!this.adminsCache) {
      this.adminsCache = this.http.get<AdminResponse>(`${this.apiUrl}/show/all`).pipe(
        map(response => response.admins),
        shareReplay(1),
        catchError(err => this.handlerError(err))
      );
    }
    return this.adminsCache;
  }

  getAdminById(id: number): Observable<AdminResponse> {
    if (!this.adminCache.has(id)) {
      const admin$ = this.http.get<AdminResponse>(`${this.apiUrl}/show/${id}`).pipe(
        map(response => response.data),
        shareReplay(1),
        catchError(err => this.handlerError(err))
      );
      this.adminCache.set(id, admin$);
    }
    return this.adminCache.get(id)!;
  }

  updateAdmin(id: number, adminData: AdminUpdateRequest): Observable<AdminResponse> {
    return this.http.put<AdminResponse>(`${this.apiUrl}/update/${id}`, adminData).pipe(
      map(response => response.data),
      catchError(err => this.handlerError(err))
    );
  }

  deleteAdmin(id: number): Observable<AdminResponse> {
    return this.http.delete<AdminResponse>(`${this.apiUrl}/delete/${id}`).pipe(
      map(response => response.data),
      catchError(err => this.handlerError(err))
    );
  }

  // Project Management
  getAllProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all-projects`).pipe(
      map(response => response.data),
      catchError(err => this.handlerError(err))
    );
  }

  searchProjects(queryParams: {
    company_name?: string;
    project_name?: string;
    category_id?: number;
  }): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/search-projects`, {
      params: queryParams as any,
    }).pipe(
      map(response => response.data),
      catchError(err => this.handlerError(err))
    );
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-project-by-id/${id}`).pipe(
      map(response => response.data),
      catchError(err => this.handlerError(err))
    );
  }

  updateProjectStatus(id: any, statusData: ProjectStatusUpdate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-project-status/${id}`, statusData).pipe(
      map(response => response.data),
      catchError(err => this.handlerError(err))
    );
  }

  clearCache(): void {
    this.adminsCache = null;
    this.adminCache.clear();
  }

  clearAdminCache(id: number): void {
    this.adminCache.delete(id);
  }

  public handlerError(err: { error?: any, message?: any, status?: number }): Observable<never> {
    if (!err) {
      return throwError('Error desconocido');
    }
  
    switch (err.error?.status) {
      case 400:
        this.notificationService.showErrorCustom(err.error.message);
        break;
      case 401:
        this.notificationService.showErrorCustom(err.error.message);
        break;
      case 404:
        this.notificationService.showErrorCustom(err.error.message);
        break;
      case 429:
        this.notificationService.showErrorCustom(err.error.message);
        break;
      case 500:
        this.notificationService.showErrorCustom(err.error.message);
        break;
      default:
        this.notificationService.showErrorCustom(err.message || 'Unknown error occurred');
    }

    if (err.error?.details?.length) {
      for (let i = 0; i < err.error.details.length; i++) {
        this.notificationService.showErrorCustom(err.error.details[i]);
      }
    }
  
    return throwError(err);
  }
}
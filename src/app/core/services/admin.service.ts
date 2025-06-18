import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { 
  Admin,
  AdminCreateRequest, 
  AdminResponse, 
  AdminUpdateRequest, 
  ProjectStatusUpdate,
  AdminLoginRequest,
  AdminLoginResponse,
  AdminProfile
} from '../models/admin';
import { NotificationService } from './notification.service';
import { HandlerErrorService } from './handler-error.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.server_url}admins`;
  private adminsChanged = new BehaviorSubject<void>(undefined);

  // Notifica cuando los admins cambian
  get adminsChanged$(): Observable<void> {
    return this.adminsChanged.asObservable();
  }

  constructor(
    private http: HttpClient,
    private handlerErrorSrv: HandlerErrorService,
  ) { }

  getProfile(): Observable<AdminProfile> {
    return this.http.get<AdminResponse>(`${this.apiUrl}/profile`).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Admin CRUD Operations
  createAdmin(adminData: AdminCreateRequest): Observable<AdminResponse> {
    return this.http.post<AdminResponse>(`${this.apiUrl}/create`, adminData).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getAllAdmins(): Observable<Admin[]> {
    return this.http.get<AdminResponse>(`${this.apiUrl}/show/all`).pipe(
      map(response => response.admins),
      shareReplay(1),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getAdminById(id: number): Observable<AdminResponse> {
    return this.http.get<AdminResponse>(`${this.apiUrl}/show/${id}`).pipe(
      map(response => response.data),
      shareReplay(1),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  updateAdmin(id: any, adminData: AdminUpdateRequest): Observable<AdminResponse> {
    return this.http.put<AdminResponse>(`${this.apiUrl}/update/${id}`, adminData).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  deleteAdmin(id: number): Observable<AdminResponse> {
    return this.http.delete<AdminResponse>(`${this.apiUrl}/delete/${id}`).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Password Operations
  forgotPassword(email: string, url_base: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email, url_base }).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  resetPassword(email: string, code: string, password: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  
      'Content-Type': 'application/json'  
    });
    return this.http.post(`${this.apiUrl}/reset-password`, { email, code, password }, { headers }).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  resendCode(token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,  // Usa 'Authorization' y el formato 'Bearer'
      'Content-Type': 'application/json'
    });
    
    return this.http.post(`${this.apiUrl}/resendCode`, {}, { headers }).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Admin Status Operations
  reactivateAdmin(id: number): Observable<AdminResponse> {
    return this.http.put<AdminResponse>(`${this.apiUrl}/reactivatedAdmin/${id}`, {}).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Image Operations
  uploadImage(id: number, image: File): Observable<AdminResponse> {
    const formData = new FormData();
    formData.append('file', image);
    
    return this.http.put<AdminResponse>(`${this.apiUrl}/upload-image/${id}`, formData).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Username Generation
  generateUsername(fullName: string): Observable<{ suggested_username: string }> {
    return this.http.post<{ suggested_username: string }>(`${this.apiUrl}/generate-username`, { full_name: fullName }).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Project Management
  getAllProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-all-projects`).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
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
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-project-by-id/${id}`).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  updateProjectStatus(id: any, statusData: ProjectStatusUpdate): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/update-project-status/${id}`, statusData).pipe(
      map(response => response.data),
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Reports Management
  getAllUserReports(status?: string, user_role?: string, page: number = 1, limit: number = 10): Observable<any> {
    const params: any = { page, limit };
    if (status) params.status = status;
    if (user_role) params.user_role = user_role;
    
    return this.http.get<any>(`${this.apiUrl}/get-all-user-reports`, { params }).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getReportById(id: number): Observable<any> {
    return this.http.get<{ data: any }>(`${this.apiUrl}/get-report/${id}`).pipe(
        catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  respondToReport(id: number, responseMessage: string, newStatus: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/respond-to-report/${id}`, { 
      responseMessage, 
      newStatus 
    }).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Notify that admins have changed
  notifyAdminsChanged(): void {
    this.adminsChanged.next();
  }
}
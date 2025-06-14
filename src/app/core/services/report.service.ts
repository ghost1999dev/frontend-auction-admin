import { NotificationService } from 'src/app/core/services/notification.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { 
    catchError, 
    map, 
    Observable, 
    shareReplay
} from 'rxjs';
import { 
    ReportResponse, 
    ReportResponseById, 
    Report,
    CreateReportRequest,
    UpdateReportRequest,
    FilterReportsParams
} from '../models/reports';
import { environment } from 'src/environments/environment';
import { HandlerErrorService } from './handler-error.service';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private reportsCache: Observable<Report[]> | null = null;
  private reportCache = new Map<number, Observable<Report>>();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private handlerErrorSrv: HandlerErrorService,
  ) { }

  // Cache management
  clearCache(): void {
    this.reportsCache = null;
    this.reportCache.clear();
  }

  clearReportCache(id: number): void {
    this.reportCache.delete(id);
  }

  // Report CRUD Operations
  createReport(reportData: CreateReportRequest): Observable<Report> {
    return this.http.post<ReportResponseById>(`${environment.server_url}reports/create`, reportData).pipe(
      map(response => {
        this.clearCache();
        return response.report;
      }),
      catchError((err) => this.handlerErrorSrv.handlerError(err))
    );
  }

  getAllReports(params?: FilterReportsParams): Observable<ReportResponse> {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key as keyof FilterReportsParams];
        if (value !== undefined) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get<ReportResponse>(`${environment.server_url}reports/show/all`, { params: httpParams }).pipe(
      catchError((err) => this.handlerErrorSrv.handlerError(err))
    );
  }

  getReportById(id: number): Observable<Report> {
    if (!this.reportCache.has(id)) {
      const report$ = this.http.get<ReportResponseById>(`${environment.server_url}reports/show/${id}`).pipe(
        map(response => response.report),
        shareReplay(1),
        catchError((err) => this.handlerErrorSrv.handlerError(err))
      );
      this.reportCache.set(id, report$);
    }
    return this.reportCache.get(id)!;
  }

  updateReport(id: number, reportData: UpdateReportRequest): Observable<Report> {
    return this.http.put<ReportResponseById>(`${environment.server_url}reports/update/${id}`, reportData).pipe(
      map(response => {
        this.clearReportCache(id);
        this.clearCache();
        return response.report;
      }),
      catchError((err) => this.handlerErrorSrv.handlerError(err))
    );
  }

  deleteReport(id: number): Observable<any> {
    return this.http.delete(`${environment.server_url}reports/delete/${id}`).pipe(
      map(response => {
        this.clearCache();
        this.clearReportCache(id);
        return response;
      }),
      catchError((err) => this.handlerErrorSrv.handlerError(err))
    );
  }
}
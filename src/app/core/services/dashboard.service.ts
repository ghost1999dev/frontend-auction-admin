import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HandlerErrorService } from './handler-error.service';
import {
  ActiveCompaniesResponse,
  ActiveDevelopersResponse,
  ProjectsByStatusResponse,
  ReportsByStatusResponse,
  TotalCategoriesResponse,
  AdminsByStatusResponse,
  RatingsDistributionResponse
} from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private handlerErrorSrv: HandlerErrorService
  ) { }

  // Individual endpoints
  getActiveCompaniesCount(): Observable<ActiveCompaniesResponse> {
    return this.http.get<ActiveCompaniesResponse>(`${environment.server_url}dashboard/count/activeCompanies`).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getActiveDevelopersCount(): Observable<ActiveDevelopersResponse> {
    return this.http.get<ActiveDevelopersResponse>(`${environment.server_url}dashboard/count/activeDevelopers`).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getProjectsByStatus(): Observable<ProjectsByStatusResponse> {
    return this.http.get<ProjectsByStatusResponse>(`${environment.server_url}dashboard/count/projectsByStatus`).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getReportsByStatus(): Observable<ReportsByStatusResponse> {
    return this.http.get<ReportsByStatusResponse>(`${environment.server_url}dashboard/count/reportsByStatus`).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getTotalCategories(): Observable<TotalCategoriesResponse> {
    return this.http.get<TotalCategoriesResponse>(`${environment.server_url}dashboard/count/totalCategories`).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getAdminsByStatus(): Observable<AdminsByStatusResponse> {
    return this.http.get<AdminsByStatusResponse>(`${environment.server_url}dashboard/count/adminsByStatus`).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  getRatingsDistribution(): Observable<RatingsDistributionResponse> {
    return this.http.get<RatingsDistributionResponse>(`${environment.server_url}dashboard/ratings/distribution`).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }

  // Combined dashboard data
  getDashboardSummary(): Observable<{
    activeCompanies: ActiveCompaniesResponse,
    activeDevelopers: ActiveDevelopersResponse,
    projectsByStatus: ProjectsByStatusResponse,
    reportsByStatus: ReportsByStatusResponse,
    totalCategories: TotalCategoriesResponse,
    adminsByStatus: AdminsByStatusResponse,
    ratingsDistribution: RatingsDistributionResponse
  }> {
    return forkJoin({
      activeCompanies: this.getActiveCompaniesCount(),
      activeDevelopers: this.getActiveDevelopersCount(),
      projectsByStatus: this.getProjectsByStatus(),
      reportsByStatus: this.getReportsByStatus(),
      totalCategories: this.getTotalCategories(),
      adminsByStatus: this.getAdminsByStatus(),
      ratingsDistribution: this.getRatingsDistribution()
    }).pipe(
      catchError(err => this.handlerErrorSrv.handlerError(err))
    );
  }
}
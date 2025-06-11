import { NotificationService } from 'src/app/core/services/notification.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, shareReplay, throwError } from 'rxjs';
import { activateReq, activateRes, addUser, addUserResponse, updateFieldsGoogle, updateFieldsGoogleRes, updatePasswordUser, updatePasswordUserResponse, updateUser, updateUserErrorResponse, updateUserResponse, userResponse, userResponseById, usersWithImage } from '../models/users';
import { environment } from 'src/environments/environment';
import { DeveloperService } from './developer.service';
import { CompaniesService } from './companies.service';
import { HandlerErrorService } from './handler-error.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private HandlerErrorSrv: HandlerErrorService,
  ) { }

  // User CRUD Operations
  getAllUsers(): Observable<usersWithImage[]> {
    return this.http.get<userResponse>(`${environment.server_url}users/show/all`).pipe(
      map(response => response.users),
      shareReplay(1),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  getUserById(id: number): Observable<usersWithImage[]> {
    return this.http.get<userResponseById>(`${environment.server_url}users/show/${id}`).pipe(
        map(response => response.user),
        shareReplay(1),
        catchError((err) => this.HandlerErrorSrv.handlerError(err))
      );
  }

  createUser(userData: addUser): Observable<addUserResponse> {
    return this.http.post<addUserResponse>(`${environment.server_url}users/create`, userData).pipe(
      map(response => {
        return response;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  updateUser(id: number, userData: updateUser): Observable<updateUserResponse> {
    return this.http.put<updateUserResponse>(`${environment.server_url}users/update/${id}`, userData).pipe(
      map(response => {
        return response;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${environment.server_url}users/delete/${id}`).pipe(
      map(response => {
        return response;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  updatePassword(id: number, passwordData: updatePasswordUser): Observable<updatePasswordUserResponse> {
    return this.http.put<updatePasswordUserResponse>(
      `${environment.server_url}users/update-password/${id}`, 
      passwordData
    ).pipe(
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  // Additional User Operations
  uploadImage(id: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', image);
    return this.http.put(`${environment.server_url}users/upload-image/${id}`, formData).pipe(
      map(response => {
        return response;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  verifyEmail(emailData: activateReq): Observable<activateRes> {
    return this.http.post<activateRes>(`${environment.server_url}users/validate-email`, emailData).pipe(
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  updateGoogleFields(id: number, fields: updateFieldsGoogle): Observable<updateFieldsGoogleRes> {
    return this.http.patch<updateFieldsGoogleRes>(
      `${environment.server_url}users/update-fields/${id}`, 
      fields
    ).pipe(
      map(response => {
        return response;
      }),
      catchError((err: any) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  public handlerError(err: { error?: any, message?: any, status?: number }): Observable<never> {
    if (!err) {
      return throwError('Error desconocido');
    }
  
    switch (err.error.status) {
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
        this.notificationService.showErrorCustom(err.message .message);
    }

    for (let i = 0; i < err.error.details.length; i++) {
      this.notificationService.showErrorCustom(err.error.details[i])
    }
  
    return throwError(err);
  }

}

  
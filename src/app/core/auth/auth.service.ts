import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, throwError } from 'rxjs';
import {catchError} from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { NotificationService } from '../services/notification.service';
import { HandlerErrorService } from '../services/handler-error.service';
import { UserAuth, UserResponseAuth } from '../models/users';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/user.service';
import { DeveloperService } from '../services/developer.service';
import { CompaniesService } from '../services/companies.service';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient, 
    private router: Router, 
    private userService: UserService,
    private companiesService: CompaniesService,
    private developerService: DeveloperService,
    private notificationServices: NotificationService,
    private HandlerErrorSrv: HandlerErrorService,
    ) {
    this.checkToken();
  }

  get isLogged(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  public login(authData: UserAuth):Observable<UserResponseAuth> {
    return this.http
    .post<UserResponseAuth>(`${environment.server_url}users/auth`, authData)
    .pipe(
      map((res: UserResponseAuth) =>{
        //save token
        this.saveToken(res.token);
        this.loggedIn.next(true);
        return res;
      }),
      catchError((err) => this.HandlerErrorSrv.handlerError(err))
    );
  }

  public logout():void{
    localStorage.removeItem('admin_token');
    localStorage.removeItem('isLoggedin');

    this.loggedIn.next(false);
    this.router.navigate(['auth/login']);
  }

  private checkToken(): void{
    let userToken = localStorage.getItem('admin_token') as string;
    const isExpired = helper.isTokenExpired(userToken);
    if(isExpired) {
      this.logout();
    }else{
      this.loggedIn.next(true);
    }
  }

  public saveToken(token:string):void{
    localStorage.setItem('admin_token', token);
  }

  IsLoggedIn() {
    return !!localStorage.getItem('admin_token');
  }

}

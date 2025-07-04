import { Injectable, NgModule } from "@angular/core";
import { Observable } from "rxjs";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class HttpRequestInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = localStorage.getItem('admin_token');
        if (token) {
            const newReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${token}`)
            });
            return next.handle(newReq);
        } else {
            return next.handle(req);
        }
    }
}

@NgModule({
    providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: HttpRequestInterceptor,
        multi: true
    }],
    declarations: []
})
export class HttpInterceptorModule {}
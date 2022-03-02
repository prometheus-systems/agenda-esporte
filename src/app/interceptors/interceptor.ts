import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { AuthGuard } from './../auth/auth.guard';
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from './../shared/loader.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()

export class Interceptor implements HttpInterceptor {
    constructor(private authService: AuthService
               ,public loaderService: LoaderService
               ,private authGuard:AuthGuard
               ,private cookieservice: CookieService) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      //debguger
      this.loaderService.show();
      let authToken:string=localStorage.getItem('token');
      if (authToken){
           let newrequest = request.clone({
            setHeaders:
              { servername: this.cookieservice.get('servername')
               ,username:   this.cookieservice.get('username')
               ,password:   this.cookieservice.get('password')
               ,database:   this.cookieservice.get('database') }
            });
           // console.log('request',newrequest);
        return next.handle(newrequest).pipe(
            finalize(() => this.loaderService.hide())
        );
      }else{
        return next.handle(request).pipe(
            finalize(() => this.loaderService.hide())
        );
     }   
    }
}
 

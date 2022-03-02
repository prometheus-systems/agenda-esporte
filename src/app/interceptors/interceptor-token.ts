import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { AuthGuard } from './../auth/auth.guard';
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoaderService } from './../shared/loader.service';

@Injectable()

export class InterceptorToken implements HttpInterceptor {
    constructor(private authService: AuthService
               ,public loaderService: LoaderService
               ,private authGuard:AuthGuard) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
       ////debugger
       this.loaderService.show();

        
          let authToken:string=localStorage.getItem('token');
          if (authToken){
               let newrequest = request.clone({
                setHeaders:
                  { Authorization: 'Bearer '+authToken }
                });
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
 

import { Injectable } from '@angular/core';

import { catchError, take, switchMap, filter, finalize } from "rxjs/operators";
import { HttpSentEvent, HttpHeaderResponse, HttpProgressEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse, HttpUserEvent } from '@angular/common/http';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';



@Injectable()
export class TokenInterceptor implements HttpInterceptor {
 
  constructor(private authService: AuthService) { }
 
  isRefreshingToken: boolean = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
 
  intercept(request: HttpRequest<any>, next: HttpHandler) : Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {
    return next.handle(this.addTokenToRequest(request))
      .pipe(
        catchError(err => {
          if (err instanceof HttpErrorResponse) {
            switch ((<HttpErrorResponse>err).status) {
              case 401:
                return this.trataErro401(request, next);
            }
          } else {
            return throwError(err);
          }
        }));
  }
 
  private addTokenToRequest(request: HttpRequest<any>) : HttpRequest<any> {
    console.log('clonou requisicao, não passa nada no headers porque o token vai via get');
    //primeiro exemplo apresentado achei que o token deveria ir via get
    return request.clone({ setHeaders: {}});
  }
 
  private trataErro401(request: HttpRequest<any>, next: HttpHandler) {

    if(!this.isRefreshingToken) {
      this.isRefreshingToken = true;
 
      this.tokenSubject.next(null);
 
      /*return this.authService.refreshToken()
        .pipe(
          switchMap((pais:any ) => {
            if(pais) {
             
              this.tokenSubject.next(pais.token);;
              
              return next.handle(this.addTokenToRequest(request));
            } 
           
          }),
          catchError(() => {
            return <any>this.authService.logout('erro no erro 401');
          }),
          finalize(() => {
            this.isRefreshingToken = false;
          })
        );*/
    } else {
      this.isRefreshingToken = false;
 
      return this.tokenSubject
        .pipe(filter(token => token != null),
          take(1),
          switchMap(token => {
          //return next.handle(request);
          return next.handle(this.addTokenToRequest(request));
        }));
    }
  }
}

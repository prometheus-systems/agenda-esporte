import { Injectable } from '@angular/core';
import { 
  ActivatedRouteSnapshot, 
  CanActivate, 
  Router, 
  RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  esta_logado(): Observable<boolean> {
    return this.authService.getStatus_logado.pipe(
        take(1),                              
        map( 
          (getStatus_logado: boolean) => {         
            if (!getStatus_logado){
              return false;
            }
            return true;
          }
        )
      )
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.getStatus_logado.pipe(
        take(1),                              
        map( 
          (getStatus_logado: boolean) => {         
            if (!getStatus_logado){
              this.router.navigate(['login'], {skipLocationChange: true, fragment: 'top'});  
              return false;
              
            }
            return true;
          }
        )
      )
  }
}
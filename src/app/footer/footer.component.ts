import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { AuthService } from './../auth/auth.service';
import { environment } from '../../environments/environment'; 
import { login } from './../model/login.model';
import { map, take } from 'rxjs/operators';
import { AuthGuard } from './../auth/auth.guard';
import { TranslateService }   from './../shared/translate.service';
import { Router } from '@angular/router';




@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit {
  
  getStatus_logado$: Observable<boolean>;  
  getResult_login$: Observable<login>; 

  constructor(private authService: AuthService
            , private _translate: TranslateService
            , private router: Router 
            , private authGuard:AuthGuard) { }

  ngOnInit() {
    this.getStatus_logado$ = this.authService.getStatus_logado;
    this.getResult_login$ = this.authService.getResult_login;      
  }     
  
  Home(){
    environment.Origem = 'N';
    this.router.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'});
  }

  Historico(){
    environment.Origem = 'H';
    this.router.navigate(['Historico'], {skipLocationChange: true, fragment: 'top'});    
  }

  Convites(){
    this.router.navigate(['Listaragenda'], {skipLocationChange: true, fragment: 'top'});    
  }

  Perfil(){
    environment.Alterar = true;
    environment.Origem = 'N';
    this.router.navigate(['Formusuarios',environment.CodigoUsuario], {skipLocationChange: true, fragment: 'top'});
  }

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment'; 
import { AuthService } from "./../auth/auth.service";
import {NotificationService} from './../shared/notification.service';
import { TranslateService }   from './../shared/translate.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {
  public translatedText: string;
  public supportedLangs: any[];

  loginForm: FormGroup;
  returnUrl: string;
 
  constructor(
     private fb: FormBuilder
    ,private router: Router
    ,private authService: AuthService
    ,private _translate : TranslateService 
    ,private notification:NotificationService 
    ) {

     }

  ngOnInit() {

    this.authService.setStatus_logado = false;
    localStorage.clear();
    this.supportedLangs = [
      { display: 'English', value: 'en' },
      { display: 'Brasil', value: 'br' },];

      // set current langage
      this.selectLang('br');

      this.loginForm = this.fb.group({
      login: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  isCurrentLang(lang: string) {
    // check if the selected lang is current lang
    return lang === this._translate.currentLang;
  }

  refreshText() {
      // refresh translation when language change
      this.translatedText = this._translate.instant('hello world');
  }

  selectLang(lang: string) {
      // set current lang;
      this._translate.use(lang);
      this.refreshText();
  }

  registrar(){
    environment.Origem = 'L';
    this.authService.setStatus_logado = true;   
    this.router.navigate(['Formusuarios'], {skipLocationChange: true, fragment: 'top'}); 
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe((data) => {
      console.log('ret login',data)
      if (data!==null){
        environment.NomeUsuario = data.nome;
        environment.CodigoUsuario = data.codigo;
        environment.EmailUsuario = data.email;
        environment.Tipo = data.for_tipo;
        let Login = {CodigoUsuario:data.codigo,NomeUsuario:data.nome,EmailUsuario:data.email,logado:true};
        this.authService.setResult_login = Login;
        this.authService.setStatus_logado = true;   
        console.log('ret login',this.authService.getResult_login)
        if (data.for_tipo=='A'){
          this.authService.setAdministrador = true;
          this.authService.setusuario = false;
          console.log('é administrador');
          this.router.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'});  
        }
        else{
          this.authService.setusuario = true;
          this.authService.setAdministrador = false;
          console.log('não é administrador'); 
          this.router.navigate(['Listaragenda'], {skipLocationChange: true, fragment: 'top'});           
        }
      } else {
        this.notification.success('Login e senha incorretos!') 
      }
    },
    );
  }
}



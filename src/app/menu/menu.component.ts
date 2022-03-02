 
import { Observable } from "rxjs"; 
import { environment } from "../../environments/environment"; 
import { TranslateService }   from './../shared/translate.service'; 
import { AuthService } from "./../auth/auth.service"; 
import { Component, OnInit } from "@angular/core"; 
import { Router } from "@angular/router"; 
import { DeviceDetectorService } from 'ngx-device-detector'; 
import { login } from "../model/login.model";
@Component({ 
  selector: 'app-menu', 
  templateUrl: "./menu.component.html", 
}) 
export class MenuComponent implements OnInit {  
  public translatedText: string;   
  public supportedLangs: any[];  
  getStatus_logado$: Observable<boolean>;  
  getAdministrador$: Observable<boolean>; 
  getusuario$: Observable<boolean>; 
  getDeviceMob$: Observable<boolean>; 
  getDeviceDes$: Observable<boolean>; 
  navbarOpen = false; 
  tipo:string='';
  getResult_login$: Observable<login>; 
  Usuario:string='';
  Email:string='';
  constructor(
      public deviceService: DeviceDetectorService
    , private authService: AuthService
    , private _translate: TranslateService
    , private router: Router) { } 
  ngOnInit() { 
    
    this.supportedLangs = [ 
     { display: 'English', value: 'en' }, 
     { display: 'Brasil', value: 'br' }, 
    ];  
 
    this.selectLang('br'); 
    if (this.deviceService.isMobile()){  
        this.authService.setDeviceMob = true; 
        environment.Device = 'M'; 
    } 

    else  
    if(this.deviceService.isTablet()){  
        this.authService.setDeviceDes = false;  
        environment.Device = 'T';  
    }  
    else 
    if (this.deviceService.isDesktop()){ 
        this.authService.setDeviceDes = true;  
        environment.Device = 'D'; 
    } 
    this.getDeviceMob$ = this.authService.getDeviceMob; 
    this.getDeviceDes$ = this.authService.getDeviceDes; 
    this.getStatus_logado$ = this.authService.getStatus_logado; 
    this.getAdministrador$ = this.authService.getAdministrador; 
    this.getusuario$ = this.authService.getusuario; 
    this.tipo = environment.Tipo;
    console.log('tipo',this.tipo);
    this.getResult_login$ = this.authService.getResult_login;   

  } 
  


  refreshText() {  
    // refresh translation when language change  
    this.translatedText = this._translate.instant('hello world'); 
  } 
  isCurrentLang(lang: string) { 
    // check if the selected lang is current lang 
    return lang === this._translate.currentLang; 
  } 
 
  selectLang(lang: string) { 
    // set current lang; 
    this._translate.use(lang); 
    this.refreshText(); 
  } 
 
    onLogout(){ 
      this.authService.setStatus_logado = false; 
      this.router.navigate(['Login'], {skipLocationChange: true, fragment: 'top'}); 
    } 
} 

import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from "../../environments/environment";  
import { login } from '../model/login.model';


@Injectable({
  providedIn: 'root'
})

export class AuthService implements OnInit { bounce_up:any;
  serverUrl = environment.URLBase;

  httpOptions = {  
    headers: new HttpHeaders({  
      'Content-Type':'application/json',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Request-Method':'POST'
    })  
  }

  errorData: {};

  private result_login = new BehaviorSubject<login>({CodigoUsuario:0,NomeUsuario:'',EmailUsuario:'',logado:false}); 
  private status_logado = new BehaviorSubject<boolean>(false); 
  private administrador = new BehaviorSubject<boolean>(false); 
  private usuario = new BehaviorSubject<boolean>(false); 
  private tem_projeto = new BehaviorSubject<boolean>(false); 
  private add_projeto = new BehaviorSubject<boolean>(false); 
  private DeviceDes = new BehaviorSubject<boolean>(null); 
  private DeviceMob = new BehaviorSubject<boolean>(null); 
  
  constructor(
 
      private http: HttpClient
    , private router: Router
    
   
  ) {}
  
  ngOnInit() {   

  }



  login(login:Login) : Observable<any> {   
    console.log(this.serverUrl+'/login');
    return this.http.post<any>(this.serverUrl+'/login',login)
  } 

  
  get getDeviceDes(){
    return this.DeviceDes.asObservable();  
  }

  set setDeviceDes(param:boolean) {
    this.DeviceDes.next(param); 
  }

  get getDeviceMob(){
    return this.DeviceMob.asObservable();  
  }

  set setDeviceMob(param:boolean) {
    this.DeviceMob.next(param); 
  }
 
  
 
  get getResult_login() {
    return this.result_login.asObservable(); 
  }

  get getStatus_logado(){
    return this.status_logado.asObservable();  
  }

  get getAdministrador(){
    return this.administrador.asObservable();  
  }

  get getusuario(){
    return this.usuario.asObservable();  
  }

  get getAdd_projeto(){
    return this.add_projeto.asObservable();  
  }

  get getTem_projeto(){
    return this.tem_projeto.asObservable();  
  }


  set setStatus_logado(param:boolean) {
    this.status_logado.next(param); 
  }

  set setAdministrador(param:boolean) {
    this.administrador.next(param); 
  }

  set setusuario(param:boolean) {
    this.usuario.next(param); 
  }

  set setAdd_projeto(param:boolean) {
    this.add_projeto.next(param); 
  }

  set setTem_projeto(param:boolean) {
    this.tem_projeto.next(param); 
  }

  set setResult_login(param:login) {
    this.result_login.next(param); 
  }

  logout() {                          
    this.status_logado.next(false);
    this.router.navigate(['/login'], {skipLocationChange: true, fragment: 'top'});
  }


}

export class Login {
  login: string;
  senha: string;
}

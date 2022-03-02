 
import {Injectable} from '@angular/core';  
import {HttpClient, HttpHeaders} from '@angular/common/http';  
import {usuarios} from "../model/usuarios.model"; 
import {Observable} from "rxjs/index"; 
import { environment } from '../../environments/environment';  
@Injectable() 
export class usuariosService  { 

  formData: usuarios;  
  formParRel:any; 
  strParametros:string=''; 
  arrusuarios:any[]=[]; 
  DataChart:any[]=[]; 
  typeChart:string;
  
  httpOptions = {  
    headers: new HttpHeaders({  
      'Content-Type':'application/json', 
      'Authorization':'Bearer '+localStorage.getItem('token')
    })  
  } 

  constructor(private http: HttpClient) { }  
  baseUrl = environment.URLBase;  
 
  postRelatoriousuarios(): Observable<any> { 
    var body = { 
      ...this.formParRel 
    }; 
    console.log(body); 
    return this.http.post<any>(this.baseUrl+'/relatorio_usuarios',body, this.httpOptions); 
  } 
 
  getRelatoriousuarios(): Observable<any> { 
    return this.http.get<any>(this.baseUrl+'/relatorio_usuarios', this.httpOptions); 
  } 
 
  getusuarios() : Observable<any>{  
    return this.http.get<usuarios>(this.baseUrl+'/usuarios', this.httpOptions); 
  } 
  
  getusuariosId(id: string): Observable<usuarios> {  
    return this.http.get<usuarios>(this.baseUrl+'/usuario/'+id, this.httpOptions); 
  }  

  gravarusuarios(operacao:string) : Observable<usuarios> { 
    var body = {  
      ...this.formData 
    };  
    console.log(body); 
    if (operacao=='I'){
      return this.http.post<any>(this.baseUrl+'/usuario' ,body, this.httpOptions); 
    }else{
      console.log(this.baseUrl+'/usuario/'+body.codigo);
      return this.http.put<any>(this.baseUrl+'/usuario/'+body.codigo ,body, this.httpOptions); 
    }
  } 

  verificaCNPJ(id,cnpj): Observable<string> {  
    console.log(this.baseUrl+'/valid_cnpj/'+id+'/'+cnpj);
    return this.http.get<string>(this.baseUrl+'/valid_cnpj/'+id+'/'+cnpj); 
  } 

  verificaEmail(id,email): Observable<string> {  
    console.log(this.baseUrl+'/valid_email/'+id+'/'+email);
    return this.http.get<string>(this.baseUrl+'/valid_email/'+id+'/'+email); 
  }

  deleteusuarios(id:number): Observable<usuarios> {  
    return this.http.delete<any>(this.baseUrl+'/usuario/'+id, this.httpOptions); 
  }  
}   

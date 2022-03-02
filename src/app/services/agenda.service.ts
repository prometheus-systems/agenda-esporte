import {Injectable} from '@angular/core';  
import {HttpClient, HttpHeaders} from '@angular/common/http';  
import {agenda} from "../model/agenda.model"; 
import {participantes} from "../model/participantes.model";
import {Observable} from "rxjs/index"; 
import { environment } from '../../environments/environment';  
import { BehaviorSubject } from 'rxjs'
import { MatTableDataSource } from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections'; 

@Injectable() 
export class agendaService  { 

  formData: agenda;  
  quadra:string='';
  arrparticipantes:any[]=[];
  arrparticipantesGeral:any[]=[];
  dataSource = new MatTableDataSource<any>();
  //dataSource:any;
  formParRel:any; 
  strParametros:string=''; 
  arragenda:any[]=[]; 
  DataChart:any[]=[]; 
  typeChart:string;
  Itemsparticipantes: participantes[]=[]; 
  arrparticipantes$: BehaviorSubject<any[]> = new BehaviorSubject(this.arrparticipantes);
  selection = new SelectionModel<any>(true, []); 
  
  codigo:number=0;
  httpOptions = {  
    headers: new HttpHeaders({  
      'Content-Type':'application/json', 
      'Authorization':'Bearer '+localStorage.getItem('token')
    })  
  } 

  constructor(private http: HttpClient) { }  
  baseUrl = environment.URLBase; 
  
  get getarrparticipantes() {
    return this.arrparticipantes$; 
  }  
  
 
  set setarrparticipantes(param:any) {  
    this.arrparticipantes$.next(param); 
  }

  SetSelected(){ 
    for (let i=0;i<this.selection.selected.length;i++){  
      for(let x=0;x<this.arrparticipantes.length;x++){  
        if ((this.selection.selected[i] == this.arrparticipantes[x])&&(this.arrparticipantes[x]!='undefined')){  
          this.arrparticipantes[x].selected = 'S'; 
        }  
      } 
    } 
  }  
 
  GetSelected(){ 
    this.selection.hasValue(); 
    this.selection.clear();
    this.dataSource.data.forEach(row => {if ((row.selected=='1')||(row.selected=='S')){this.selection.select(row)}}); 
    console.log(this.selection); 
  } 
 
  /*update(index, field, value) {  
    this.arrparticipantes = this.arrparticipantes.map((e, i) => { 
      if (index === i) {
        return { 
          ...e, 
          [field]: value  
        }  
      } 
      return e;  
    });  
    this.arrparticipantes$.next(this.arrparticipantes);  
    this.dataSource.data = this.arrparticipantes;  
    console.log(this.arrparticipantes);  
    console.log(this.dataSource);  

  }*/
 
  postRelatorioagenda(): Observable<any> { 
    var body = { 
      ...this.formParRel 
    }; 
    console.log(body); 
    return this.http.post<any>(this.baseUrl+'/relatorio_agenda',body, this.httpOptions); 
  } 
 
  getRelatorioagenda(): Observable<any> { 
    return this.http.get<any>(this.baseUrl+'/relatorio_agenda', this.httpOptions); 
  } 

  gethoras(data): Observable<any> { 
    debugger
    let strdata = this.ConverteData(data.toLocaleString());//this.ConverteData(data.toLocaleString());
    console.log(this.baseUrl+'/horas/'+strdata+'/'+this.quadra);
    return this.http.get<any>(this.baseUrl+'/horas/'+strdata+'/'+this.quadra, this.httpOptions); 
  } 

  ConverteData(data:string){
    let mydate:string='';
    mydate = data.substr(6,4)+'-'+data.substr(3,2)+'-'+data.substr(0,2);
    return mydate;
  }
 
 
  getagenda() : Observable<any>{  
    console.log('convites',this.baseUrl+'/agendas/'+environment.CodigoUsuario);
    return this.http.get<agenda>(this.baseUrl+'/agendas/'+environment.CodigoUsuario, this.httpOptions); 
  } 

  getConvites() : Observable<any>{  
    console.log('convites',this.baseUrl+'/convites/'+environment.CodigoUsuario);
    return this.http.get<any>(this.baseUrl+'/convites/'+environment.CodigoUsuario, this.httpOptions); 
  }
  
  getagendaparticipantes(id){  
    console.log(this.baseUrl+'/participantes/'+id);
    return this.http.get<participantes>(this.baseUrl+'/participantes/'+id, this.httpOptions); 
  } 

  getparticipantes(): Observable<any>{  
    console.log(this.baseUrl+'/participantes');
    return this.http.get<any>(this.baseUrl+'/participantes', this.httpOptions); 
  } 

 
  getagendaId(id: string): Observable<agenda> {  
    console.log(this.baseUrl+'/agenda/'+id);
    return this.http.get<agenda>(this.baseUrl+'/agenda/'+id, this.httpOptions); 
  }  

  gravarParticipacao(datasource) : Observable<any> { 
    debugger
    let confirmadas:any[]=[];
    console.log('confirmado',datasource.data);
    if ((Array.isArray(datasource.data))&&(datasource.data.length)){    
      for(let i=0;i<datasource.data.length;i++){
        if (datasource.data[i].selected==='S'){
          confirmadas.push({"agenda":datasource.data[i].codigo,"usuario":datasource.data[i].usuario,"confirmado":"Sim"})
        }
      }
      if ((Array.isArray(confirmadas))&&(confirmadas.length)){ 
        var body = {  
          agendas: confirmadas
        }; 
        console.log(body); 
        console.log('participação',this.baseUrl+'/confirmadas');
        return this.http.post<any>(this.baseUrl+'/confirmadas',body, this.httpOptions);
      } 
    }
  } 

  gravaragenda(operacao:string) : Observable<any> { 
    var body = {  
      ...this.formData 
       , items: this.arrparticipantes
    }; 
    console.log(body); 
    if (operacao=='I'){
      return this.http.post<any>(this.baseUrl+'/agenda' ,body, this.httpOptions); 
    }else{
      console.log(this.baseUrl+'/agenda/'+this.codigo);
      return this.http.post<any>(this.baseUrl+'/agenda/'+this.codigo ,body, this.httpOptions); 
    }
    
  } 



  deleteagenda(id:number): Observable<agenda> {  
    return this.http.delete<any>(this.baseUrl+'/agenda/'+id, this.httpOptions); 
  }  
}   

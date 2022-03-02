import {Component, OnInit} from "@angular/core"; 
import {Router,ActivatedRoute} from "@angular/router"; 
import {NgForm} from "@angular/forms"; 
import {agendaService} from "../../services/agenda.service"; 
import {DialogService} from "../../shared/dialog.service"; 
import {NotificationService} from "../../shared/notification.service"; 
import { first } from "rxjs/operators"; 
import { AuthService } from "../../auth/auth.service";
import {map} from 'rxjs/operators';  
import {Observable} from 'rxjs'; 
import {usuariosService} from "../../services/usuarios.service";
import {usuarios} from "../../model/usuarios.model";
 
@Component({ 
  selector: 'app-filtrorel-agenda', 
  templateUrl: './filtrorel-agenda.component.html', 
}) 
export class FiltrorelagendaComponent implements OnInit { 
  isValid: boolean = true; 
  arrusuarios:Observable<any[]>; 
 
  //DECLARACAO DO CONSTRUTOR E SUAS VARIAVEIS PRIVADAS E PASSAGEM DOS SERVICES 
  constructor( 
     private router: Router 
   , public apiService: agendaService 
   , private dialogService: DialogService 
   , private notification:NotificationService 
   , private authService: AuthService 
   , private apiusuarios:usuariosService
  ) { }  
  //FUNCAO DE INICIALIZACAO AO CHAMAR A ROTA DA PAGINA FAZ LOAD DOS DADOS E ARRAY DE CHAVES ESTRANGEIRAS 
  ngOnInit() { 
    this.apiusuarios.getusuarios().subscribe( data => {  
      this.arrusuarios = data; 
      console.log('combo',data); 
      return data; 
    }); 
    this.resetForm(); 
  } 
  resetForm(form?: NgForm) {//NOVO REGISTRO RESET DADOS E COLOCAR VALORES PADROES 
    if (form = null) 
      form.resetForm(); 
    this.apiService.formParRel = {
      par_data1:new Date(),
      par_data2:new Date(), 
      par_usuario:'',
    }; 
  } 
 
  validateForm() { //FUNCAO QUE VALIDA DADOS DO FORM  
    this.isValid = true; 
    if (this.apiService.formParRel.par_data1 == null) 
      this.isValid = false; 
      if (this.apiService.formParRel.par_data2 == null) 
      this.isValid = false; 
    return this.isValid; 
  }  
 
  onSubmit(form: NgForm) { //ENVIANDO DADOS DO FORM PARA SERVICE CHAMAR A FUNCAO PARA GRAVAR NO BACKEND 
    if (this.validateForm()) { 
      this.apiService.postRelatorioagenda() 
        .pipe(first()) 
        .subscribe( 
           dados => { 
              console.log('relatorio',dados);  
              this.apiService.arragenda = dados; 
              this.authService.setStatus_logado = false; 
              this.apiService.strParametros = 'Data Inicial: '+this.formatDate(this.apiService.formParRel.par_data1)+' Data Final: '+this.formatDate(this.apiService.formParRel.par_data2);
              if ((this.apiService.formParRel.par_usuario!==undefined)&&(this.apiService.formParRel.par_usuario!==null)&&(this.apiService.formParRel.par_usuario!==''))
                this.apiService.strParametros = this.apiService.strParametros + ' - usuario - '+this.apiService.formParRel.par_usuario;
              console.log('para',this.apiService.strParametros) 
              this.router.navigate(['Relatorioagenda'], {skipLocationChange: true, fragment: 'top'}); 
           }, 
           error => { 
             console.log('erro:',error); 
        }); 
    }else{ 
      this.notification.success('Favor preencher os campos obrigatórios!') 
    } 
  } 
 
 formatDate(vDate:Date){ 
    let dia = vDate.getDate(); 
    let mes = vDate.getMonth()+1; 
    let ano = vDate.getFullYear(); 
    let strDate:string = dia+'/'+mes+'/'+ano; 
    return strDate; 
  } 
 
  onCancelar() { 
    this.router.navigate(['Listaragenda'], {skipLocationChange: true, fragment: 'top'}); 
  } 
} //FIM - CONSTRUTOR

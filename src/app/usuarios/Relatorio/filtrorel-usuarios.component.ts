import {Component, OnInit} from "@angular/core"; 
import {Router,ActivatedRoute} from "@angular/router"; 
import {NgForm} from "@angular/forms"; 
import {usuariosService} from "../../services/usuarios.service"; 
import {DialogService} from "../../shared/dialog.service"; 
import {NotificationService} from "../../shared/notification.service"; 
import { first } from "rxjs/operators"; 
import { AuthService } from "../../auth/auth.service";
import {map} from 'rxjs/operators';  
import {Observable} from 'rxjs'; 
//import {grupo_usuariosService} from "../../services/grupo_usuarios.service";
//import {grupo_usuarios} from "../../model/grupo_usuarios.model";
 
@Component({ 
  selector: 'app-filtrorel-usuarios', 
  templateUrl: './filtrorel-usuarios.component.html', 
}) 
export class FiltrorelusuariosComponent implements OnInit { 
  isValid: boolean = true; 
  //arrgrupo_usuarios:Observable<any[]>; 
 
  //DECLARACAO DO CONSTRUTOR E SUAS VARIAVEIS PRIVADAS E PASSAGEM DOS SERVICES 
  constructor( 
     private router: Router 
   , public apiService: usuariosService 
   , private dialogService: DialogService 
   , private notification:NotificationService 
   , private authService: AuthService 
   //, private apigrupo_usuarios:grupo_usuariosService
  ) { }  
  //FUNCAO DE INICIALIZACAO AO CHAMAR A ROTA DA PAGINA FAZ LOAD DOS DADOS E ARRAY DE CHAVES ESTRANGEIRAS 
  ngOnInit() { 
    /*this.apigrupo_usuarios.getgrupo_usuarios().subscribe( data => {  
      this.arrgrupo_usuarios = data; 
      console.log('combo',data); 
      return data; 
    }); */
    this.resetForm(); 
  } 
  resetForm(form?: NgForm) {//NOVO REGISTRO RESET DADOS E COLOCAR VALORES PADROES 
    if (form = null) 
      form.resetForm(); 
    this.apiService.formParRel = { 
      gus_descricao:'',
    }; 
  } 
 
  validateForm() { //FUNCAO QUE VALIDA DADOS DO FORM  
    this.isValid = true; 
    if (this.apiService.formParRel.gus_descricao == null) 
      this.isValid = false; 
    return this.isValid; 
  }  
 
  onSubmit(form: NgForm) { //ENVIANDO DADOS DO FORM PARA SERVICE CHAMAR A FUNCAO PARA GRAVAR NO BACKEND 
    if (this.validateForm()) { 
      this.apiService.postRelatoriousuarios() 
        .pipe(first()) 
        .subscribe( 
           dados => { 
              console.log('relatorio',dados);  
              this.apiService.arrusuarios = dados; 
              this.authService.setStatus_logado = false; 
              this.apiService.strParametros = '    Descrição - '+this.apiService.formParRel.gus_descricao+''; 
              console.log('para',this.apiService.strParametros) 
              this.router.navigate(['Relatoriousuarios'], {skipLocationChange: true, fragment: 'top'}); 
           }, 
           error => { 
             console.log('erro:',error); 
        }); 
    }else{ 
      this.notification.success('Favor preencher os campos obrigatórios!') 
    } 
  } 
 
 formatDate(vDate:Date){ 
    let dia = vDate.getDate()-1; 
    let mes = vDate.getMonth()+1; 
    let ano = vDate.getFullYear(); 
    let strDate = dia+'/'+mes+'/'+ano; 
    return strDate; 
  } 
 
  onCancelar() { 
    this.router.navigate(['Listarusuarios'], {skipLocationChange: true, fragment: 'top'}); 
  } 
} //FIM - CONSTRUTOR

 
import {Component, OnInit} from '@angular/core'; 
import {Router,ActivatedRoute} from "@angular/router"; 
import {usuarios} from "../../model/usuarios.model"; 
import {NgForm} from "@angular/forms"; 
import {first} from "rxjs/operators"; 
import {usuariosService} from "../../services/usuarios.service"; 
import {Observable} from 'rxjs'; 
import {map} from 'rxjs/operators'; 
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'; 
import {DialogService} from '../../shared/dialog.service'; 
import {Location} from '@angular/common'; 
import {NotificationService} from '../../shared/notification.service'; 

import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth/auth.service';
import { UploadService } from 'src/app/services/upload.service';
@Component({ 
  selector: 'app-form-usuarios', 
  templateUrl: './form-usuarios.component.html', 
}) 
export class FormusuariosComponent implements OnInit { 
  isValid: boolean = true; 
  troca_senha:boolean = false;
  tipo:string='';
  vRetorno:any;
  emailErro :boolean;
  cnpjErro  :boolean;
  Valido:boolean;
  selectedFiles: FileList;
  imagem_nome:string;
  files: Set<File>; 
  fileNames:any[]=[]; 

  constructor( 
     private router: ActivatedRoute  
   , private myrouter: Router 
   , public apiService: usuariosService 
   , private dialog: MatDialog 
   , private location:Location 
   , private dialogService: DialogService 
   , private notification:NotificationService 
   , private authService: AuthService
   , private uploadService: UploadService 
   //, private apigrupo_usuarios:grupo_usuariosService 

  ) { } 
  ngOnInit() {  
    let id = this.router.snapshot.paramMap.get('id'); 
    if (id){ 
      this.apiService.getusuariosId(id).subscribe( data => { 
        data.status_reg = 'U'; 
        this.apiService.formData = data; 
        console.log('id',data);
        this.apiService.formData.status_reg = 'U'; 
        this.Valido = true;
      });  
    }else{  
      this.resetForm(); 
    }  
    //LOAD DOS ARRAY CHAVE ESTRANGEIRA 
    /*this.arrgrupo_usuarios = this.apigrupo_usuarios.getgrupo_usuarios().pipe( 
      map(dados => { 
      console.log(dados); 
      return dados; 
    }));  */
    this.tipo = environment.Tipo;
     
  }  

  upload() {
    //debugger
    const file = this.selectedFiles.item(0);
    this.imagem_nome = 'SGM'+file.name;
    
    this.uploadService.uploadFile(file);

    }

  onFileSelect(event) { 
    const selectedFiles = <FileList>event.srcElement.files; 
    this.selectedFiles = selectedFiles;
    const fileNames = []; 
    this.files = new Set(); 
    for (let i = 0; i < selectedFiles.length; i++) { 
       this.fileNames.push(selectedFiles[i].name); 
       this.files.add(selectedFiles[i]); 
     } 
  } 



  resetForm(form?: NgForm) {//NOVO REGISTRO RESET DADOS E COLOCAR VALORES PADROES
    //debugger 
    if (form = null)  
      form.resetForm(); 
  
    this.apiService.formData = { 
      codigo: null, 
      nome: null, 
      fone: null,  
      senha: null, 
      email:null,
      foto:null,
      status_reg:'I',
      senhaant:null,
      senhanov1:null,
      senhanov2:null  
    };  
  }  
  validateForm() { //FUNCAO QUE VALIDA DADOS DO FORM
    this.isValid = true; 
    if (this.apiService.formData==null) 
      this.isValid = false; 
    else if ((this.apiService.formData.nome == null) || (this.apiService.formData.nome == '') )
      this.isValid = false; 
    else if ((this.apiService.formData.fone == null) || (this.apiService.formData.fone == '') ) 
      this.isValid = false;    
    else if ((this.apiService.formData.email == null) || (this.apiService.formData.email == '') )
      this.isValid = false; 
    else if ((this.apiService.formData.senha == null) || (this.apiService.formData.senha == '') )
      this.isValid = false; 
    return this.isValid; 
  } 
  validaNovaSenha(){
    let valido = true; 
    if (this.troca_senha){
      if (this.apiService.formData.senhaant !== null) 
      {
        if ((this.apiService.formData.senhanov1 == null)||(this.apiService.formData.senhanov2 == null))
          valido = false;
        if (this.apiService.formData.senhanov1 !== this.apiService.formData.senhanov2)
          valido = false;
      }  
    }
    return valido; 
  }

  validaEmail(id,email:string){
    //debugger
    this.apiService.verificaEmail(id,email)
    .subscribe( data => {  
      this.vRetorno = data as any;

      if(this.vRetorno.retorno=='ERRO') {
        this.emailErro = true;
        this.Valido=false;
      }
      else if (this.vRetorno.retorno=='OK'){
        this.emailErro = false;
        this.Valido=true;
      }  
      console.log('VU',data); 
    });
  }
  strip(valor){
    let result = valor.replace('.','');
    result = result.replace('/','');
    result = result.replace('-','');
    return result;
  }

  validaCNPJ(id,cnpj:string){
    //debugger
    console.log('cnpj',cnpj);
    let strip_cnpj = this.strip(cnpj)
    console.log('cnpj',cnpj);
    this.apiService.verificaCNPJ(id,strip_cnpj)
    .subscribe( data => {  
      this.vRetorno = data as any;

      if(this.vRetorno.retorno=='ERRO') {
        this.cnpjErro = true;
        this.Valido=false;
      }
      else if (this.vRetorno.retorno=='OK'){
        this.cnpjErro = false;
        this.Valido=true;
      }  
      console.log('VU',data); 
    });
  }

  
  onSubmit(form: NgForm) { //ENVIANDO DADOS DO FORM PARA SERVICE CHAMAR A FUNCAO PARA GRAVAR NO BACKEND
    debugger
    

      if (this.validateForm()) { 
        this.apiService.formData.foto = 'https://dv5p92anj1xfr.cloudfront.net/'+this.imagem_nome;
        this.apiService.gravarusuarios(this.apiService.formData.status_reg) 
          .pipe(first()) 
          .subscribe( 
            data => {  
              debugger
              console.log('ret-update',data);
              if (this.apiService.formData.status_reg == 'U'){ 
                if(data.codigo > 0) { 
                    console.log('usuario atualizado com suceso.',data); 
                }else { 
                  console.log('erro ao atulizar usuario'); 
                }  
                this.myrouter.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'});
                
              }else{  
                  console.log('ret-insert',data);
                  if(data.codigo > 0) { 
                    console.log('usuario inserido com sucesso.',data); 
                    this.authService.setStatus_logado = false;   
                    this.myrouter.navigate(['Login'], {skipLocationChange: true, fragment: 'top'});
                    this.resetForm();
                  }else { 
                    this.notification.success('usuario já Existe!'); 
                    console.log('erro ao inserir usuario',data); 
                  }
                } 
            
            }, 
            error => { 
              console.log('erro:',error); 
          }); 
      }else{  
        this.notification.success('Favor preencher os campos obrigatórios!') 
      }
      
  }  
  onCancelar() { 
    
    if (this.apiService.formData.status_reg == 'U'){
      this.myrouter.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'});
    }else{
      this.authService.setStatus_logado = false;
      this.myrouter.navigate(['Login'], {skipLocationChange: true, fragment: 'top'});
    } 
  } 
} //FIM - EXPORTS 

import {Component, OnInit , ElementRef, ViewChild} from '@angular/core'; 
import {Router,ActivatedRoute} from "@angular/router";  
import {NgForm} from "@angular/forms"; 
import {first, map} from "rxjs/operators"; 
import {MatDialog, MatDialogConfig} from '@angular/material/dialog'; 
import {agendaService} from "../../services/agenda.service";  
import {MatPaginator} from '@angular/material/paginator';  
import {MatSort} from '@angular/material/sort'; 
import {DialogService} from '../../shared/dialog.service'; 
import {NotificationService} from '../../shared/notification.service'; 
import {environment} from 'src/environments/environment';
import { LoadImage } from 'src/app/shared/loadimage.component';
@Component({ 
  selector: 'app-form-agenda', 
  templateUrl: './form-agenda.component.html', 
}) 
export class FormagendaComponent implements OnInit { 
  isValid: boolean = true; 
  tipo:string='';
  vRetorno:any;
  displayedColumns: string[] = ['selected','foto','nome']; 
  arrhorasget:any[]=[];
  arrhoras:any[]=[];
  temhora:boolean=false;
  count:number=0;
  total:number=0;
  raquetes:boolean;
  baseUrl:string='https://d1phjd34tdox10.cloudfront.net/sgm';

  highlight(element: ElementRef) {
    element.nativeElement.style.backgroundColor.highlighted = !element.nativeElement.style.backgroundColor.highlighted;
  }

  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;   
  @ViewChild(MatSort, { static: true })
  sort!: MatSort; 
  
  constructor( 
     //private router: ActivatedRoute  
    private myrouter: Router 
   , public apiService: agendaService 
   , private dialog: MatDialog 
   //, private location:Location 
   , private dialogService: DialogService 
   , private notification:NotificationService 

  ) { }

  onClickViewImage(image:string){ 
    this.FormImage(image) 
  } 

  FormImage(image:string) {  
    const dialogConfig = new MatDialogConfig(); 
    dialogConfig.autoFocus = true; 
    dialogConfig.disableClose = true; 
    dialogConfig.width = "90%"; 
    dialogConfig.data = { image }; 
    this.dialog.open(LoadImage, dialogConfig).afterClosed().subscribe(res => {  
    });   
  }  


  isAllSelected() {
    const numSelected = this.apiService.selection.selected.length;
    const numRows = this.apiService.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ?
    this.apiService.selection.clear() :
    this.apiService.dataSource.data.forEach(row => this.apiService.selection.select(row));
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.apiService.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  ngOnInit() {  
    debugger
    this.apiService.getparticipantes() 
    .subscribe( 
       dados => { 
            //this.apiService.arrparticipantes = dados; 
            if (Array.isArray(dados) && dados.length){ 
              console.log('dados',dados);
              this.apiService.arrparticipantes = dados;
              this.apiService.setarrparticipantes = dados; 
              console.log('usuarios',this.apiService.arrparticipantes);
              this.apiService.dataSource.data = dados;  
              console.log('datasource',this.apiService.dataSource.data);
              if (Array.isArray(this.apiService.dataSource.data) && this.apiService.dataSource.data.length){ 
                for(let x=0;x<this.apiService.dataSource.data.length;x++){ 
                  if (this.apiService.dataSource.data[x].foto){ 
                    this.apiService.dataSource.data[x].foto= this.apiService.dataSource.data[x].foto; 
                  }else{  
                    this.apiService.dataSource.data[x].foto = this.baseUrl+'/alternative.png';  
                  }  
                }   
              }
            }
       }); 


    this.resetForm();
    this.apiService.GetSelected();
  }

  getHoras(data){
    debugger
    this.apiService.gethoras(data)
      .subscribe(
        dados => {
        console.log('horas',dados);
        let hora:string='';
        debugger
        this.arrhoras = [];
        let inc:number=1;
        if ((Array.isArray(dados))&&(dados.length>0)){
          for (let i=7;i<21;i=i+inc){
            inc = 1;
            hora='';
            if (i<10){
              hora = '0'+i+':00';
            }else{
              hora = i+':00';
            }
            this.temhora=true;
            let insere:boolean=true;
            for (let y=0;y<dados.length;y++){
              if (hora.trim() === dados[y].horaini.trim()){
                insere = false;
                inc = dados[y].qtde_horas;
                break;
              } 
            } 
            if (insere)
              this.arrhoras.push({"hora":hora}); 
          }
        }
        else{
          for (let i=7;i<21;i++){
            hora='';
            if (i<10){
              hora = '0'+i+':00';
            }else{
              hora = i+':00';
            }
            this.temhora=true;
            this.arrhoras.push({"hora":hora});
          }        
        }
        console.log('horas',this.arrhoras);
    });

        
  }

  addRaquete(){
    if (!this.raquetes){
      this.total = this.total + 10;
    }else{
      this.total = this.total - 10;
    }
    
  }

  addHora(hora){
    this.count = this.count+1;
    if (this.count===1){
      this.apiService.formData.horaini = hora;
    }
    else
    if (this.count>1){
      
      let raquete:number = 0;
      if (this.raquetes)
        raquete=10;

      hora = hora.substr(0,3)+'59';
      this.apiService.formData.horafin = hora;
      this.apiService.formData.qtde_horas = (parseInt(this.apiService.formData.horafin.substr(0,2)) - parseInt(this.apiService.formData.horaini.substr(0,2)))+1;
      if (this.apiService.formData.quadra == 'Quadra 01'){
        this.total = (this.apiService.formData.qtde_horas * 70.00)+raquete;
      }else{
        this.total = (this.apiService.formData.qtde_horas * 70.00)+raquete;
      }
      this.apiService.formData.raquete = this.raquetes;
      this.apiService.formData.total = this.total; 
      if (parseInt(this.apiService.formData.horafin.substr(0,2))<parseInt(this.apiService.formData.horaini.substr(0,2)))
      {
        this.count = 1;
        this.apiService.formData.horafin = null;
        this.total = null;
      }  
      else{
        this.count = 0;
      }
      
    }
  }

  onGravar(){
    if (this.validateForm()) { 
      this.apiService.gravaragenda(this.apiService.formData.status_reg) 
        .pipe(first()) 
        .subscribe( 
          data => {  
            debugger
            console.log('ret-update',data);
            if (this.apiService.formData.status_reg == 'U'){ 
              if(data.retorno == 'OK') { 
                  console.log('agenda atualizado com suceso.',data); 
              }else { 
                console.log('erro ao atulizar agenda'); 
              }  
              this.myrouter.navigate(['Listaragenda'], {skipLocationChange: true, fragment: 'top'});              
            }else{  
              console.log('ret-insert',data);
              if(data.retorno === 'OK') { 
                console.log('agenda inserido com sucesso.',data); 
                this.myrouter.navigate(['Listaragenda'], {skipLocationChange: true, fragment: 'top'});
                //this.resetForm();
              }else { 
                this.notification.success('agenda já Existe!'); 
                console.log('erro ao inserir agenda',data); 
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
  

  


  resetForm(form?: NgForm) {//NOVO REGISTRO RESET DADOS E COLOCAR VALORES PADROES
    //debugger 
    if (form = null)  
      form.resetForm(); 
  
    this.apiService.formData = { 
      codigo:null,
      usuario:environment.CodigoUsuario,
      data:null,
      horaini:null,
      horafin:null,
      quadra:this.apiService.quadra,
      qtde_horas:null,
      raquete:null,
      total:null,
      status_reg :'I'
    };  
  }

  
  validateForm() { //FUNCAO QUE VALIDA DADOS DO FORM
    debugger
    this.isValid = true;     
    if (this.apiService.formData==null) 
      this.isValid = false; 
    else if ((this.apiService.formData.data == null) )
      this.isValid = false; 
    else if ((this.apiService.formData.horaini == null) ) 
      this.isValid = false;    
    else if ((this.apiService.formData.horafin == null) ) 
      this.isValid = false;   
    return this.isValid; 
  } 

 onSubmit(form: NgForm) { //ENVIANDO DADOS DO FORM PARA SERVICE CHAMAR A FUNCAO PARA GRAVAR NO BACKEND
    debugger
      if (this.validateForm()) { 
        this.apiService.gravaragenda(this.apiService.formData.status_reg) 
          .pipe(first()) 
          .subscribe( 
            data => {  
              debugger
              console.log('ret-update',data);
              if (this.apiService.formData.status_reg == 'U'){ 
                if(data.retorno == 'OK') { 
                    console.log('agenda atualizado com suceso.',data); 
 
                }else { 
                  console.log('erro ao atulizar agenda'); 
                }  
                
                this.myrouter.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'});
                
              }else{  
                  console.log('ret-insert',data);
                  if(data.retorno=='OK') { 
                    console.log('agenda inserido com sucesso.',data); 
                    this.myrouter.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'});
                    this.resetForm();
                  }else { 
                    //this.notification.success('agenda já Existe!'); 
                    console.log('erro ao inserir agenda',data); 
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
    this.myrouter.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'});
  } 
} //FIM - EXPORTS 

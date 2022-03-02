import { Component, OnInit , ViewChild , ElementRef} from '@angular/core'; 
import {Router} from "@angular/router"; 
import {agenda} from "../../model/agenda.model"; 
import {agendaService} from "../../services/agenda.service";  
import {MatPaginator} from '@angular/material/paginator';  
import {MatTableDataSource} from '@angular/material/table'; 
import {MatSort} from '@angular/material/sort'; 
import {MaterialModules} from '../../materials-modules'; 
import { DialogService } from '../../shared/dialog.service'; 
import { NotificationService } from '../../shared/notification.service'; 
import { first, map } from "rxjs/operators"; 
import { AuthService } from "../../auth/auth.service"; 
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadImage } from 'src/app/shared/loadimage.component';
 
@Component({ 
  selector: 'app-listar-agenda', 
  templateUrl: './listar-agenda.component.html',
})  
export class ListaragendaComponent implements OnInit { 

  displayedColumns: string[] = ['selected','data','hora','quadra','nome']; 
  dataSource: any;  
  arragenda:agenda[]=[];
  arrparticipantes:any;
  temParticipantes:boolean;
  temDados:boolean=false;
  baseUrl:string='https://d1phjd34tdox10.cloudfront.net/sgm';
  formData:any;
  highlight(element: ElementRef) {
    element.nativeElement.style.backgroundColor.highlighted = !element.nativeElement.style.backgroundColor.highlighted;
  }
 
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;   
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;  
  // CONSTRUTOR E VARIAVES PRIVADAS 
  constructor(private router: Router   
            , public apiService: agendaService  
            , private materialmodule: MaterialModules  
            , private dialogService: DialogService  
            , private authService: AuthService 
            , private dialog : MatDialog
            , private notification:NotificationService) { } 

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
          
  
  ngOnInit() { //INICIAR PAGINA DE LISTA
    this.apiService.getConvites() 
    .subscribe( dados => {  
      if (Array.isArray(dados) && dados.length){ 
        console.log('convites',dados); 
        this.apiService.setarrparticipantes = dados; 
        this.apiService.dataSource.data = dados;  
        this.temDados = true;
      }else{
        this.temDados = false;
        this.notification.success('Nenhum convite disponível!') 
        this.router.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'}); 
      }
    }); 
    this.apiService.GetSelected();
  }  
  
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

  
  participantes(reg:any){
    this.formData = reg;
    this.apiService.getagendaparticipantes(reg.codigo) 
          .subscribe(itens => {
            if ((Array.isArray(itens))&&(itens.length)){
              this.temParticipantes = true;
              this.arrparticipantes = itens;
              if (Array.isArray(this.arrparticipantes) && this.arrparticipantes.length){ 
                for(let x=0;x<this.arrparticipantes.length;x++){ 
                  if (this.arrparticipantes[x].foto){ 
                    this.arrparticipantes[x].foto= this.arrparticipantes[x].foto; 
                  }else{  
                    this.arrparticipantes[x].foto = this.baseUrl+'/alternative.png';  
                  }  
                }   
              }
            
            }else{
              this.temParticipantes = false;
            }
            
          });
        }
  
  /*participantes(reg:agenda){
    this.apiService.getagendaparticipantes(reg.codigo) 
    .subscribe( data => {  
      if (Array.isArray(data) && data.length){ 
        console.log('lista participantes',data); 
        this.apiService.arrparticipantesGeral = data;
        //this.apiService.setarrparticipantes = data; 
      } 
    }); 
  }
*/
  gravarConvite(){
    debugger
    this.apiService.gravarParticipacao(this.apiService.dataSource)
    .pipe(first()) 
    .subscribe( 
      data => {  
        debugger
        console.log('ret-participacao',data);
        if(data.retorno == 'OK') { 
            console.log('participação atualizado com suceso.',data); 
        }else { 
          console.log('erro ao atulizar participacao'); 
        }  
        this.apiService.getConvites() 
          .subscribe( dados => {  
            if (Array.isArray(dados) && dados.length){ 
              console.log('convites',dados); 
              this.apiService.setarrparticipantes = dados; 
              this.apiService.dataSource.data = dados;  
              this.temDados = true;
            }else{
              this.temDados = false;
               
              this.router.navigate(['Inicial'], {skipLocationChange: true, fragment: 'top'}); 
             
            }
          });
        //this.router.navigate(['Listaragenda'], {skipLocationChange: true, fragment: 'top'});              
      }, 
      error => { 
        console.log('erro:',error); 
    }); 
  }
  
 
  applyFilter(filterValue: string) { 
    this.dataSource.filter = filterValue.trim().toLowerCase();  
  }  

  applyFilterGroup(filterValue: string) { 
    this.dataSource.filter = filterValue.trim();  
  }
 
  deleteagenda(Regagenda: agenda): void { //CHAMA SERVICE PARA EXCLUSÃO NO BACKEND
    let i = this.arragenda.findIndex(u => u === Regagenda); //BUSCA INDICE PARA EXCLUSSÃO NO ARRAY 
    this.dialogService.openConfirmDialog('Deseja excluir esse registro?') 
    .afterClosed().subscribe(res =>{ 
      if(res){ 
        this.apiService.deleteagenda(Regagenda.codigo) 
          .subscribe( data => { 
            this.arragenda.splice(i, 1); 
            this.dataSource = new MatTableDataSource<any>(this.arragenda); 
            this.dataSource.paginator = this.paginator; 
            this.dataSource.sort = this.sort; 
            this.notification.success('Excluído com sucesso!')  
          }) 
      } 
    }); 
  }; 
  
  editagenda(Regagenda: agenda): void {  //CHAMA ROTA PARA FORM INSERT
    this.router.navigate(['Formagenda',Regagenda.codigo], {skipLocationChange: true, fragment: 'top'}); 
  }; 
  
  insertagenda(): void { //CHAMA ROTA PARA FORM INSERT
    this.router.navigate(['Formagenda'], {skipLocationChange: true, fragment: 'top'}); 
  }; 
 
  filtrorelagenda(): void {  //CHAMA ROTA PARA FORM INSERT 
    this.router.navigate(['Filtrorelagenda'], {skipLocationChange: true, fragment: 'top'}); 
    
  }; 
 
} //FIM - CONSTRUTOR

import { Component, OnInit , ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MaterialModules} from '../materials-modules';
import { environment } from '../../environments/environment'; 
import { DialogService } from '../shared/dialog.service';
import { NotificationService } from '../shared/notification.service';
import { TranslateService }   from './../shared/translate.service';
//import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { agendaService } from '../services/agenda.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {LoadImage} from '../shared/loadimage.component';

declare var $: any;
@Component({
  selector: 'app-historico',
  templateUrl: './historico.component.html'
})


export class HistoricoComponent implements OnInit {
  public data: any;
  notifier;
  idleTime = 0;
  origem:string='';
  baseUrl:string='https://d1phjd34tdox10.cloudfront.net/sgm';
  constructor(
     // private toastr: rService
      notifierService: NotificationService
    , private router: Router 
    , private dialog : MatDialog 
    , public apiService: agendaService  
    , private _translate: TranslateService
    , private materialmodule: MaterialModules
    , private dialogService: DialogService
    , private authService:AuthService
    , private notification:NotificationService) { 
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.origem = environment.Origem;
    this.apiService.getagenda() 
    .subscribe( dados => {  
      this.apiService.arragenda = dados;
      if (Array.isArray(dados) && dados.length){ 
        for (let i=0;i<dados.length;i++){
          this.apiService.getagendaparticipantes(dados[i].codigo) 
          .subscribe(itens => {
            this.apiService.arragenda[i].participantes = itens;
            if (Array.isArray(this.apiService.arragenda[i].participantes) && this.apiService.arragenda[i].participantes.length){ 
              for(let x=0;x<this.apiService.arragenda[i].participantes.length;x++){ 
                if (this.apiService.arragenda[i].participantes[x].foto){ 
                  this.apiService.arragenda[i].participantes[x].foto= this.apiService.arragenda[i].participantes[x].foto; 
                }else{  
                  this.apiService.arragenda[i].participantes[x].foto = this.baseUrl+'/alternative.png';  
                }  
              }   
              
            }
          });
        }
        console.log('historico',this.apiService.arragenda); 
      }
    });
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


}
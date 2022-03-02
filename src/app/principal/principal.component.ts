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
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoadImage } from '../shared/loadimage.component';
declare var $: any;
@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html'
})


export class PrincipalComponent implements OnInit {
  public data: any;
  notifier;
  idleTime = 0;
  origem:string='';
  constructor(
     // private toastr: rService
      notifierService: NotificationService
    , private router: Router 
    , private _translate: TranslateService
    , private materialmodule: MaterialModules
    , private dialogService: DialogService
    , private authService:AuthService
    , public apiService: agendaService  
    , private notification:NotificationService) { 
    this.notifier = notifierService;
  }

  ngOnInit() {
    this.origem = environment.Origem;
  }

  agendar(quadra){
    this.apiService.quadra = quadra;
    this.router.navigate(['Formagenda'], {skipLocationChange: true, fragment: 'top'});
  }





}
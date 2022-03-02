import { Component, OnInit , ViewChild} from '@angular/core'; 
import {Router} from "@angular/router"; 
import {usuarios} from "../../model/usuarios.model"; 
import {usuariosService} from "../../services/usuarios.service"; 
 
import {MatPaginator} from '@angular/material/paginator';  
import {MatTableDataSource} from '@angular/material/table'; 
import {MatSort} from '@angular/material/sort'; 
import {MaterialModules} from './../../materials-modules'; 
 
import { DialogService } from '../../shared/dialog.service'; 
import { NotificationService } from '../../shared/notification.service'; 
import { first, map } from "rxjs/operators"; 
import { AuthService } from "../../auth/auth.service"; 
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
 
@Component({ 
  selector: 'app-listar-usuarios', 
  templateUrl: './listar-usuarios.component.html',
})  
export class ListarusuariosComponent implements OnInit { 

  displayedColumns: string[] = ['codigo','nome','fone','email','buttons']; 
  dataSource: any;  
  arrusuarios:usuarios[]=[];
 
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;   
  @ViewChild(MatSort, { static: true })
  sort!: MatSort;  
  // CONSTRUTOR E VARIAVES PRIVADAS 
  constructor(private router: Router   
            , public apiService: usuariosService  
            , private materialmodule: MaterialModules  
            , private dialogService: DialogService  
            , private authService: AuthService 
            , private notification:NotificationService) { } 
  
  ngOnInit() { //INICIAR PAGINA DE LISTA
    this.apiService.getusuarios() 
    .subscribe( data => {  
      if (Array.isArray(data) && data.length){ 
        this.arrusuarios = data;  
        console.log('lista',data); 
        this.dataSource = new MatTableDataSource<any>(this.arrusuarios); 
        this.dataSource.paginator = this.paginator; 
        this.dataSource.sort = this.sort; 
      } 
    }); 
  }      
  
 
  applyFilter(filterValue: string) { 
    this.dataSource.filter = filterValue.trim().toLowerCase();  
  }  

  applyFilterGroup(filterValue: string) { 
    this.dataSource.filter = filterValue.trim();  
  }
 
  deleteusuarios(Regusuarios: usuarios): void { //CHAMA SERVICE PARA EXCLUSÃO NO BACKEND
    let i = this.arrusuarios.findIndex(u => u === Regusuarios); //BUSCA INDICE PARA EXCLUSSÃO NO ARRAY 
    this.dialogService.openConfirmDialog('Deseja excluir esse registro?') 
    .afterClosed().subscribe(res =>{ 
      if(res){ 
        this.apiService.deleteusuarios(Regusuarios.codigo) 
          .subscribe( data => { 
            this.arrusuarios.splice(i, 1); 
            this.dataSource = new MatTableDataSource<any>(this.arrusuarios); 
            this.dataSource.paginator = this.paginator; 
            this.dataSource.sort = this.sort; 
            this.notification.success('Excluído com sucesso!')  
          }) 
      } 
    }); 
  }; 
  
  editusuarios(Regusuarios: usuarios): void {  //CHAMA ROTA PARA FORM INSERT
    this.router.navigate(['Formusuarios',Regusuarios.codigo], {skipLocationChange: true, fragment: 'top'}); 
  }; 
  
  insertusuarios(): void { //CHAMA ROTA PARA FORM INSERT
    this.router.navigate(['Formusuarios'], {skipLocationChange: true, fragment: 'top'}); 
  }; 
 
  filtrorelusuarios(): void {  //CHAMA ROTA PARA FORM INSERT 
    this.apiService.getRelatoriousuarios() 
      .pipe(first()) 
      .subscribe( 
        dados => { 
          this.authService.setStatus_logado = false;  
          console.log('relatorio',dados);  
          this.apiService.arrusuarios = dados; 
          this.router.navigate(['Relatoriousuarios'], {skipLocationChange: true, fragment: 'top'}); 
        }, 
        error => { 
          console.log('erro:',error); 
      }); 
  }; 
 
} //FIM - CONSTRUTOR

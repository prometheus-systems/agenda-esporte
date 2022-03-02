import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PrincipalComponent} from "./principal/principal.component";
import {HistoricoComponent} from "./historico/historico.component";
import {LoginComponent} from "./login/login.component";
//INICIO -- usuarios
import {ListarusuariosComponent}  from "./usuarios/Listar/listar-usuarios.component";
import {FormusuariosComponent}  from "./usuarios/Form/form-usuarios.component";
import {RelatoriousuariosComponent}  from "./usuarios/Relatorio/relatorio-usuarios.component";
import {FiltrorelusuariosComponent}  from "./usuarios/Relatorio/filtrorel-usuarios.component";
//FIM -- usuarios
//INICIO -- agenda
import {ListaragendaComponent}  from "./agenda/Listar/listar-agenda.component";
import {FormagendaComponent}  from "./agenda/Form/form-agenda.component";
import {RelatorioagendaComponent}  from "./agenda/Relatorio/relatorio-agenda.component";
import {FiltrorelagendaComponent}  from "./agenda/Relatorio/filtrorel-agenda.component";
//FIM -- agenda

import {MenuComponent}  from "./menu/menu.component";
import {AuthGuard} from './auth/auth.guard';
const routes: Routes = [
  //INICIO -- usuarios
  {path: 'Listarusuarios',     component: ListarusuariosComponent },
  {path: 'Formusuarios/:id',   component: FormusuariosComponent},
  {path: 'Formusuarios',       component: FormusuariosComponent},
  {path: 'Filtrorelusuarios',  component: FiltrorelusuariosComponent},
  {path: 'Relatoriousuarios',  component: RelatoriousuariosComponent},
 //FIM -- usuarios

   //INICIO -- agenda
   {path: 'Listaragenda',     component: ListaragendaComponent },
   {path: 'Formagenda/:id',   component: FormagendaComponent},
   {path: 'Formagenda',       component: FormagendaComponent},
   {path: 'Filtrorelagenda',  component: FiltrorelagendaComponent},
   {path: 'Relatorioagenda',  component: RelatorioagendaComponent},
  //FIM -- agenda
  {path: 'Menu',    component: MenuComponent },
  {path: 'Inicial', component: PrincipalComponent, canActivate: [AuthGuard] },
  {path: 'Historico', component: HistoricoComponent },
  {path : 'Login',  component: LoginComponent   },
  {path : '',       component: LoginComponent   },
];

//, canActivate: [AuthGuard]
@NgModule({
  imports: [
    RouterModule.forRoot(
      routes,
      { enableTracing: false, relativeLinkResolution: "legacy" } // <-- debugging purposes only
 // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}

 
import {BrowserModule} from '@angular/platform-browser'; 
import {NgModule, LOCALE_ID} from '@angular/core'; 
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common'; 
//import { FlexLayoutModule } from '@angular/flex-layout'; 
//import { DateTimePickerModule} from 'ngx-datetime-picker'; 
//import {BrancoComponent} from './branco/branco.component';  
import { DeviceDetectorService  } from 'ngx-device-detector';  
//import { ServiceWorkerModule } from '@angular/service-worker';  
//import { AmplifyAngularModule, AmplifyService, AmplifyModules  } from 'aws-amplify-angular';   
//import Auth from '@aws-amplify/auth';  
//import Interactions from '@aws-amplify/interactions';  
//import Storage from '@aws-amplify/storage';  
import { environment } from '../environments/environment'  
import { TranslateService }   from './shared/translate.service'; 
import { TRANSLATION_PROVIDERS}   from './shared/translate';
import { TranslatePipe }   from './shared/translate.pipe'; 
import {AuthService} from './auth/auth.service';  
import {AuthGuard} from './auth/auth.guard'; 
import {AppComponent} from './app.component';  
import {LoginComponent} from './login/login.component'; 
import {PrincipalComponent} from './principal/principal.component'; 
import {HistoricoComponent} from './historico/historico.component'; 
import { EditableComponent } from './shared/editable.component'; 
import { ViewModeDirective } from './shared/view-mode.directive'; 
import { EditModeDirective } from './shared/edit-mode.directive'; 
import { FocusableDirective } from './shared/focusable.directive'; 
import { EditableOnEnterDirective } from './shared/edit-on-enter.directive'; 
import {LoadImage} from './shared/loadimage.component'; 
import { LoaderService } from './shared/loader.service'; 
import { Interceptor } from './interceptors/interceptor'; 
import {LoaderComponent } from './shared/loader.component'; 
//import { MaterialFileInputModule } from 'ngx-material-file-input';  
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatNativeDateModule } from '@angular/material/core';

//import { NgGanttEditorModule } from 'ng-gantt' 
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
//import {participantesComponent}  from "./participantes/participantes.component"; 
//FIM -- agenda  
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http"; 
import {ReactiveFormsModule,FormsModule} from "@angular/forms";  
import {AppRoutingModule} from "./app.routing";
import {APP_BASE_HREF} from '@angular/common'; 
import {MenuComponent} from './menu/menu.component'; 
import {FooterComponent} from './footer/footer.component';  
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'; 
import {MatTableModule} from '@angular/material/table';
import { MaterialFileInputModule } from 'ngx-material-file-input'; 
import {MatPaginatorModule} from '@angular/material/paginator';  
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input'; 
import {MaterialModules} from './materials-modules'; 
import {MatConfirmDialogComponent } from './shared/dialog.component'; 
import { GoogleChartsModule } from 'angular-google-charts'; 
import {NgxMaskModule} from 'ngx-mask'; 
import {DateAdapter, MAT_DATE_FORMATS} from '@angular/material/core'; 
import {MatDialogModule} from "@angular/material/dialog"; 
import { usuariosFilterPipe } from './shared/usuarios-filter.pipe';
import { CookieService } from 'ngx-cookie-service'
import { MatDatepickerModule } from "@angular/material/datepicker";
import {usuariosService} from "./services/usuarios.service"; 
import { agendaFilterPipe } from './shared/agenda-filter.pipe';
import {agendaService} from "./services/agenda.service";
import {participantesService} from "./services/participantes.service";

registerLocaleData(localePt, 'pt-BR');
@NgModule({ 
  declarations: [ 
    MenuComponent, 
    //participantesComponent,
    FooterComponent,
    TranslatePipe,  
    LoadImage, 
    LoaderComponent,  
    AppComponent, 
    LoginComponent, 
    PrincipalComponent,  
    HistoricoComponent,  
    EditableComponent,  
    ViewModeDirective,  
    EditModeDirective,  
    FocusableDirective,  
    EditableOnEnterDirective,  
    ListarusuariosComponent,  
    FormusuariosComponent,   
    FiltrorelusuariosComponent,   
    RelatoriousuariosComponent,  
    usuariosFilterPipe,  

    ListaragendaComponent,  
    FormagendaComponent,   
    FiltrorelagendaComponent,   
    RelatorioagendaComponent,  
    agendaFilterPipe, 
  ],     
  imports: [  
    MaterialFileInputModule,
    GoogleChartsModule, 
    ReactiveFormsModule, 
    FormsModule,
    MatDialogModule, 
    NgxMaskModule.forRoot(), 
    BrowserAnimationsModule, 
    MaterialModules, 
    BrowserModule,  
    AppRoutingModule,  
    HttpClientModule, 
    BrowserAnimationsModule, 
    MatTableModule,   
    MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatNativeDateModule, MatInputModule 
  ], 
  exports: [MatButtonModule, MatCheckboxModule],  
  providers: [ 
      TRANSLATION_PROVIDERS, TranslateService, 
      LoaderService, 
       usuariosService,
       agendaService,
       participantesService,
    AuthService,  
    AuthGuard, 
     {provide: LOCALE_ID, useValue: 'pt-BR'},
     {provide: MAT_DATE_LOCALE, useValue: 'pt-BR'},  
     {provide: APP_BASE_HREF, useValue: '/'}, 
      {provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi : true}, //desabilidado pois usavaparamandar o token no headers   
      
  ], 
    bootstrap: [AppComponent], 
    entryComponents:[MatConfirmDialogComponent
    ,LoadImage  
    ,RelatoriousuariosComponent 
    ,RelatorioagendaComponent 
]}) 
export class AppModule { } 

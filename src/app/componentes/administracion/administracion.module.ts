import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material/material.module';
import { AdministracionRougintModule } from './administracion-routing.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { AgmCoreModule } from '@agm/core';

import { AdministracionActasComponent } from './administracion-actas/administracion-actas.component';
import { RecepcionActasComponent } from './recepcion-actas/recepcion-actas.component';
import { DialogoDetalleRecepcionComponent } from './dialogo-detalle-recepcion/dialogo-detalle-recepcion.component';
import { DialogoDetalleActasComponent } from './dialogo-detalle-actas/dialogo-detalle-actas.component';
import { DialogoValidacionActaComponent } from './dialogo-validacion-acta/dialogo-validacion-acta.component';
import { AutorizarActasComponent } from './autorizar-actas/autorizar-actas.component';
import { DialogoMotivosComponent } from './dialogo-motivos/dialogo-motivos.component';
import { DialogoCalificarComponent } from './dialogo-calificar/dialogo-calificar.component';
import { SeguimientoFoliosComponent } from './seguimiento-folios/seguimiento-folios.component';
import { DialogoReportarComponent } from './dialogo-reportar/dialogo-reportar.component';
import { SeguimientoServicioComponent } from './seguimiento-servicio/seguimiento-servicio.component';
import { DialogoInformacionComponent } from './dialogo-informacion/dialogo-informacion.component';
import { DialogoSeleccionServiciosComponent } from './dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';
import { DialogoAdminTecnicosComponent } from './dialogo-admin-tecnicos/dialogo-admin-tecnicos.component';
import { DialogoTecnicoComponent } from './dialogo-tecnico/dialogo-tecnico.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AdministracionActasComponent, 
    RecepcionActasComponent, 
    DialogoDetalleRecepcionComponent, 
    DialogoDetalleActasComponent, 
    DialogoValidacionActaComponent, 
    AutorizarActasComponent, 
    DialogoMotivosComponent, 
    DialogoCalificarComponent, 
    SeguimientoFoliosComponent, 
    DialogoReportarComponent, 
    SeguimientoServicioComponent,
    DialogoInformacionComponent,
    DialogoSeleccionServiciosComponent,
    DialogoAdminTecnicosComponent,
    DialogoTecnicoComponent],
    imports: [
      ReactiveFormsModule,
      FormsModule,
      CommonModule,
      RouterModule,
      MaterialModule,
      AgmCoreModule.forRoot({
        apiKey:'AIzaSyCGVkgX-1INmPY2CDOxTva6iYboNH2MOBo'
        //apiKey: 'AIzaSyAJCOvD8jUs7ArT_w_a-I4_DhlDKPi6ic8'
      }),
      NgxMatSelectSearchModule,
      AdministracionRougintModule    
    ],
  entryComponents: [
    DialogoDetalleRecepcionComponent, 
    DialogoDetalleActasComponent, 
    DialogoValidacionActaComponent, 
    DialogoMotivosComponent, 
    DialogoCalificarComponent, 
    DialogoReportarComponent,
    DialogoInformacionComponent,
    DialogoSeleccionServiciosComponent,
    DialogoAdminTecnicosComponent,
    DialogoTecnicoComponent]
})
export class AdministracionModule { }
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OperacionesRoutingModule } from './operaciones-routing.module';
import { AgmCoreModule } from '@agm/core';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

import { MisServiciosComponent } from './mis-servicios/mis-servicios.component';
import { SeguimientoServiciosComponent } from './seguimiento-servicios/seguimiento-servicios.component';
import { MisTecnicosComponent } from './mis-tecnicos/mis-tecnicos.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogoCitaComponent } from './dialogo-cita/dialogo-cita.component';
import { DialogoInformacionComponent } from './dialogo-informacion/dialogo-informacion.component';
import { DialogoMotivosComponent } from './dialogo-motivos/dialogo-motivos.component';
import { DialogoTecnicoComponent } from './dialogo-tecnico/dialogo-tecnico.component';
import { DialogoSucursalComponent } from './dialogo-sucursal/dialogo-sucursal.component';
import { DialogoHistoricoComponent } from './dialogo-historico/dialogo-historico.component';
import { MiCalendarioComponent } from './mi-calendario/mi-calendario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { registerLocaleData } from '@angular/common';
import ESP from '@angular/common/locales/es';
import { DialogoAdminTecnicosComponent } from './dialogo-admin-tecnicos/dialogo-admin-tecnicos.component';
import { DialogoActasComponent } from './dialogo-actas/dialogo-actas.component';
import { ArmadoActasComponent } from './armado-actas/armado-actas.component';
import { CalendarioGeneralComponent } from './calendario-general/calendario-general.component';
import { DialogoEnvioComponent } from './dialogo-envio/dialogo-envio.component';
import { DialogoSolicitudActasComponent } from './dialogo-solicitud-actas/dialogo-solicitud-actas.component';
import { DialogoSeleccionServiciosComponent } from './dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';


registerLocaleData(ESP);

@NgModule({
  declarations: [MisServiciosComponent, SeguimientoServiciosComponent, MisTecnicosComponent, DialogoCitaComponent, DialogoInformacionComponent, DialogoMotivosComponent, DialogoTecnicoComponent, DialogoSucursalComponent, DialogoHistoricoComponent, MiCalendarioComponent, DialogoAdminTecnicosComponent, DialogoActasComponent, ArmadoActasComponent, CalendarioGeneralComponent, DialogoEnvioComponent, DialogoSolicitudActasComponent, DialogoSeleccionServiciosComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCGVkgX-1INmPY2CDOxTva6iYboNH2MOBo'
      //apiKey: 'AIzaSyAJCOvD8jUs7ArT_w_a-I4_DhlDKPi6ic8'
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    NgxMatSelectSearchModule,
    OperacionesRoutingModule
  ],
  entryComponents: [DialogoCitaComponent, DialogoInformacionComponent, DialogoMotivosComponent, DialogoTecnicoComponent, DialogoSucursalComponent, DialogoHistoricoComponent, DialogoAdminTecnicosComponent, DialogoActasComponent, DialogoEnvioComponent, DialogoSolicitudActasComponent, DialogoSeleccionServiciosComponent]
})
export class OperacionesModule { }

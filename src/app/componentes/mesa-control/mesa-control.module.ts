import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { RouterModule } from '@angular/router';

import { MesaControlRoutingModule } from './mesa-control-routing.module';
import { AgmCoreModule } from '@agm/core';

import { NuevoFolioComponent } from './nuevo-folio/nuevo-folio.component';
import { SeguimientoFoliosComponent } from './seguimiento-folios/seguimiento-folios.component';
import { DialogoSeleccionServiciosComponent } from './dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';
import { DialogoFolioComponent } from './dialogo-folio/dialogo-folio.component';
import { DialogoMotivosComponent } from './dialogo-motivos/dialogo-motivos.component';
import { DialogoServiciosComponent } from './dialogo-servicios/dialogo-servicios.component';
import { DialogoSucursalComponent } from './dialogo-sucursal/dialogo-sucursal.component';
import { DialogoInformacionComponent } from './dialogo-informacion/dialogo-informacion.component';
import { DialogoActasComponent } from './dialogo-actas/dialogo-actas.component';
import { DialogoAdminTecnicosComponent } from './dialogo-admin-tecnicos/dialogo-admin-tecnicos.component';
import { DialogoTecnicoComponent } from './dialogo-tecnico/dialogo-tecnico.component';
import { DialogoImportadorComponent } from './dialogo-importador/dialogo-importador.component';
import { ImportadorComponent } from './importador/importador.component';
import { ImportadorpassComponent } from './importadorpass/importadorpass.component';

@NgModule({
  declarations: [
    NuevoFolioComponent, 
    SeguimientoFoliosComponent, 
    DialogoSeleccionServiciosComponent, 
    DialogoFolioComponent, 
    DialogoMotivosComponent, 
    DialogoServiciosComponent, 
    DialogoSucursalComponent, 
    DialogoInformacionComponent, 
    DialogoActasComponent, 
    DialogoAdminTecnicosComponent, 
    DialogoTecnicoComponent, 
    DialogoImportadorComponent, 
    ImportadorComponent, ImportadorpassComponent],
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
    MesaControlRoutingModule
  ],
  entryComponents: [DialogoSeleccionServiciosComponent, DialogoFolioComponent, DialogoMotivosComponent, DialogoServiciosComponent, DialogoSucursalComponent, DialogoInformacionComponent, DialogoActasComponent, DialogoAdminTecnicosComponent, DialogoTecnicoComponent,DialogoImportadorComponent]
})
export class MesaControlModule { }

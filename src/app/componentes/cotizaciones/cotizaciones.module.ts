import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

import { CotizacionesRoutingModule } from './cotizaciones-routing.module';

import { SeguimientoCotizacionesComponent } from './seguimiento-cotizaciones/seguimiento-cotizaciones.component';
import { MaterialModule } from 'src/app/material/material.module';
import { DialogoCotizacionComponent } from './dialogo-cotizacion/dialogo-cotizacion.component';
import { NuevaCotizacionComponent } from './nueva-cotizacion/nueva-cotizacion.component';
import { RouterModule } from '@angular/router';
import { DialogoSeleccionServiciosComponent } from './dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';
import { DialogoRegistroTrasladoComponent } from './dialogo-registro-traslado/dialogo-registro-traslado.component';
import { DialogoRegistroViaticosComponent } from './dialogo-registro-viaticos/dialogo-registro-viaticos.component';
import { DialogoMotivosComponent } from './dialogo-motivos/dialogo-motivos.component';
import { DialogoOtTcComponent } from './dialogo-ot-tc/dialogo-ot-tc.component';
import { SeguimientoGeneralesComponent } from './seguimiento-generales/seguimiento-generales.component';

@NgModule({
  declarations: [SeguimientoCotizacionesComponent, DialogoCotizacionComponent, NuevaCotizacionComponent, DialogoSeleccionServiciosComponent, DialogoRegistroTrasladoComponent, DialogoRegistroViaticosComponent, DialogoMotivosComponent, DialogoOtTcComponent, SeguimientoGeneralesComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    CotizacionesRoutingModule
  ],
  entryComponents: [DialogoCotizacionComponent, DialogoSeleccionServiciosComponent, DialogoRegistroTrasladoComponent, DialogoRegistroViaticosComponent, DialogoMotivosComponent],
  providers: []
})
export class CotizacionesModule { }

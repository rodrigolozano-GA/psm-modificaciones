import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { MaterialModule } from 'src/app/material/material.module';


import { GastosRoutingModule } from './gastos-routing.module';
import { NuevoGastoComponent } from './nuevo-gasto/nuevo-gasto.component';
import { DialogoDividirMontoComponent } from './dialogo-dividir-monto/dialogo-dividir-monto.component';
import { SeguimientoGastosComponent } from './seguimiento-gastos/seguimiento-gastos.component';
import { DialogoGastoComponent } from './dialogo-gasto/dialogo-gasto.component';
import { DialogoProductosComponent } from './dialogo-productos/dialogo-productos.component';
import { DialogoReportarComponent } from './dialogo-reportar/dialogo-reportar.component';
import { DialogoAgregarConceptoComponent } from './dialogo-agregar-concepto/dialogo-agregar-concepto.component';
import { DialogoMotivosComponent } from './dialogo-motivos/dialogo-motivos.component';

@NgModule({
  declarations: [NuevoGastoComponent, DialogoDividirMontoComponent, SeguimientoGastosComponent, DialogoGastoComponent, DialogoProductosComponent, DialogoReportarComponent, DialogoAgregarConceptoComponent, DialogoMotivosComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCGVkgX-1INmPY2CDOxTva6iYboNH2MOBo'
     // apiKey:'AIzaSyCcVIFjfgy5uXlUhVhwiayw9XYW_ktTg2k'
    }),
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    GastosRoutingModule
  ],
  entryComponents: [DialogoDividirMontoComponent, DialogoGastoComponent, DialogoProductosComponent, DialogoReportarComponent, DialogoAgregarConceptoComponent, DialogoMotivosComponent]
})
export class GastosModule { }

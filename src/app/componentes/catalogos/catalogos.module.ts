import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from 'src/app/material/material.module';
import { CatalogosRoutingModule } from './catalogos-routing.module';

import { EstatusComponent } from './estatus/estatus.component';
import { GastosComponent } from './gastos/gastos.component';
import { TiposDocumentosComponent } from './tipos-documentos/tipos-documentos.component';
import { TiposServiciosComponent } from './tipos-servicios/tipos-servicios.component';
import { ZonasComponent } from './zonas/zonas.component';
import { DialogoInformacionComponent } from './dialogo-informacion/dialogo-informacion.component';
import { TiposEstatusComponent } from './tipos-estatus/tipos-estatus.component';
import { MotivosEstatusComponent } from './motivos-estatus/motivos-estatus.component';
import { CoordinadoresComponent } from './coordinadores/coordinadores.component';
import { TecnicosComponent } from './tecnicos/tecnicos.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { ConceptoGastosComponent } from './gastos/concepto-gastos/concepto-gastos.component';
import { CatalogoGastosComponent } from './gastos/catalogo-gastos/catalogo-gastos.component';
import { MediosComponent } from './medios/medios.component';
import { EquiposComponent } from './equipos/equipos.component';
import { DialogoGastoConceptosComponent } from './gastos/dialogo-gasto-conceptos/dialogo-gasto-conceptos.component';
import { FormatoActasComponent } from './formato-actas/formato-actas.component';

@NgModule({
  declarations: [EstatusComponent,
    GastosComponent,
    TiposDocumentosComponent,
    TiposServiciosComponent,
    ZonasComponent, 
    DialogoInformacionComponent, 
    TiposEstatusComponent, 
    MotivosEstatusComponent, 
    CoordinadoresComponent, 
    TecnicosComponent, 
    ConceptoGastosComponent, 
    CatalogoGastosComponent, 
    MediosComponent, 
    EquiposComponent, 
    DialogoGastoConceptosComponent, 
    FormatoActasComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    CatalogosRoutingModule
  ],
  entryComponents: [DialogoInformacionComponent, DialogoGastoConceptosComponent]
})
export class CatalogosModule { }

// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MisServiciosComponent } from './mis-servicios/mis-servicios.component';
import { SeguimientoServiciosComponent } from './seguimiento-servicios/seguimiento-servicios.component';
import { MisTecnicosComponent } from './mis-tecnicos/mis-tecnicos.component';
import { MiCalendarioComponent } from './mi-calendario/mi-calendario.component';
import { CalendarioGeneralComponent } from './calendario-general/calendario-general.component';
import { ArmadoActasComponent } from './armado-actas/armado-actas.component';
// Componentes
const routes: Routes = [
  { path: 'MisServicios', component: MisServiciosComponent },
  { path: 'SeguimientoServicios', component: SeguimientoServiciosComponent },
  { path: 'MisTecnicos', component: MisTecnicosComponent },
  { path: 'MiCalendario', component: MiCalendarioComponent},
  { path: 'ArmadoActas', component: ArmadoActasComponent},
  { path: 'CalendarioGeneral', component: CalendarioGeneralComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OperacionesRoutingModule { }

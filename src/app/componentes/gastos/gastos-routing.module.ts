import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NuevoGastoComponent } from './nuevo-gasto/nuevo-gasto.component';
import { SeguimientoGastosComponent } from './seguimiento-gastos/seguimiento-gastos.component';

const routes: Routes = [
  {path: "NuevoGasto", component: NuevoGastoComponent},
  {path: "SeguimientoGastos", component: SeguimientoGastosComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GastosRoutingModule { }

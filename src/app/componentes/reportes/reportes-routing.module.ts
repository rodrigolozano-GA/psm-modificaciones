import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReporteAnaliticoComponent } from './reporte-analitico/reporte-analitico.component';

const routes: Routes = [
  {path: 'ReporteAnalitico', component: ReporteAnaliticoComponent }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }

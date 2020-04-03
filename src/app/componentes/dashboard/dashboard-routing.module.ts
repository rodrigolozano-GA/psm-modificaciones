import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OperativoComponent } from './operativo/operativo.component';

const routes: Routes = [
  {path: 'Operativo', component: OperativoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }

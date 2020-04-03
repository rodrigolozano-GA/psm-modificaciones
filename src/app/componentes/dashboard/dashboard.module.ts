import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperativoComponent } from './operativo/operativo.component';
import { MaterialModule } from 'src/app/material/material.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DashboardRoutingModule } from './dashboard-routing.module';



@NgModule({
  declarations: [OperativoComponent],
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMatSelectSearchModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }

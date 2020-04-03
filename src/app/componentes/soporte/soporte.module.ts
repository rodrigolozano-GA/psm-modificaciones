import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoporteComponent } from './soporte/soporte.component';
import { MaterialModule } from 'src/app/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [SoporteComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SoporteComponent
  ]
})
export class SoporteModule { }

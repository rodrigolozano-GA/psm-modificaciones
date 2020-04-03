// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { SeguimientoCotizacionesComponent } from './seguimiento-cotizaciones/seguimiento-cotizaciones.component';
import { NuevaCotizacionComponent } from './nueva-cotizacion/nueva-cotizacion.component';
import { SeguimientoGeneralesComponent } from './seguimiento-generales/seguimiento-generales.component';

const routes: Routes = [
    { path: 'SeguimientoCotizaciones', component: SeguimientoCotizacionesComponent},
    { path: 'NuevaCotizacion', component: NuevaCotizacionComponent},
    { path: 'SeguimientoGenerales', component: SeguimientoGeneralesComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CotizacionesRoutingModule { }

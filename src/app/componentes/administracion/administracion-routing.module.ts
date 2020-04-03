// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdministracionActasComponent } from './administracion-actas/administracion-actas.component';
import { RecepcionActasComponent } from './recepcion-actas/recepcion-actas.component';
import { AutorizarActasComponent } from './autorizar-actas/autorizar-actas.component';
import { SeguimientoFoliosComponent } from './seguimiento-folios/seguimiento-folios.component';
import { SeguimientoServicioComponent } from './seguimiento-servicio/seguimiento-servicio.component';

const routes: Routes = [
    { path: 'AdministracionActas', component: AdministracionActasComponent },
    { path: 'AutorizacionActas', component: AutorizarActasComponent },
    { path: 'RecepcionActasOperacionales', component: RecepcionActasComponent },
    { path: 'SeguimientoFolios', component: SeguimientoFoliosComponent },
    { path: 'SeguimientoServicio', component: SeguimientoServicioComponent }

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AdministracionRougintModule { }
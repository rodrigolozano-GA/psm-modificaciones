// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { NuevoFolioComponent } from './nuevo-folio/nuevo-folio.component';
import { SeguimientoFoliosComponent } from './seguimiento-folios/seguimiento-folios.component';
import { ImportadorComponent } from './importador/importador.component';
import { ImportadorpassComponent } from './importadorpass/importadorpass.component';


const routes: Routes = [
    { path: 'NuevoServicio', component: NuevoFolioComponent },
    { path: 'SeguimientoServicios', component: SeguimientoFoliosComponent },
    { path: 'ImportadorServicios', component: ImportadorComponent },
    { path: 'Importadorpass', component: ImportadorpassComponent  },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MesaControlRoutingModule { }

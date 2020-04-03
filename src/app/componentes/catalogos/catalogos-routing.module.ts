// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { EstatusComponent } from './estatus/estatus.component';
import { GastosComponent } from './gastos/gastos.component';
import { TiposDocumentosComponent } from './tipos-documentos/tipos-documentos.component';
import { TiposServiciosComponent } from './tipos-servicios/tipos-servicios.component';
import { ZonasComponent } from './zonas/zonas.component';
import { TiposEstatusComponent } from './tipos-estatus/tipos-estatus.component';
import { MotivosEstatusComponent } from './motivos-estatus/motivos-estatus.component';
import { CoordinadoresComponent } from './coordinadores/coordinadores.component';
import { TecnicosComponent } from './tecnicos/tecnicos.component';
import { MediosComponent } from './medios/medios.component';
import { EquiposComponent } from './equipos/equipos.component';
import { FormatoActasComponent } from './formato-actas/formato-actas.component';


const routes: Routes = [
    { path: 'Estatus', component: EstatusComponent },
    { path: 'Gastos', component: GastosComponent },
    { path: 'TiposDocumentos', component: TiposDocumentosComponent },
    { path: 'TiposServicios', component: TiposServiciosComponent },
    { path: 'Zonas', component: ZonasComponent },
    { path: 'TiposEstatus', component: TiposEstatusComponent },
    { path: 'MotivosEstatus', component: MotivosEstatusComponent },
    // { path: 'Coordinadores', component: CoordinadoresComponent},
    // { path: 'Tecnicos', component: TecnicosComponent},
    { path: 'Medios', component: MediosComponent},
    { path: 'Equipos', component: EquiposComponent},
    { path: 'FormatoActas', component: FormatoActasComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class CatalogosRoutingModule { }

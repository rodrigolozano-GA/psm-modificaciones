// Core
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { from } from 'rxjs';
import { SoporteComponent } from './componentes/soporte/soporte/soporte.component';
import { AuthGuard } from './guards/auth.guard';




const routes: Routes = [
  { path: 'Login', component: LoginComponent},
  { 
    path: 'Administracion',
    loadChildren: './componentes/administracion/administracion.module#AdministracionModule' 
  },
  { path: 'Dashboard',loadChildren:'./componentes/dashboard/dashboard.module#DashboardModule'},
  { path: 'Catalogos', loadChildren: './componentes/catalogos/catalogos.module#CatalogosModule'},
  { path: 'Cotizaciones', loadChildren: './componentes/cotizaciones/cotizaciones.module#CotizacionesModule'},
  { path: 'Operaciones', loadChildren: './componentes/operaciones/operaciones.module#OperacionesModule'},
  { path: 'Reportes',loadChildren:'./componentes/reportes/reportes.module#ReportesModule'},
  { path: 'MesaControl', loadChildren: './componentes/mesa-control/mesa-control.module#MesaControlModule'},
  { path: 'Gastos', loadChildren: './componentes/gastos/gastos.module#GastosModule'},
  { path: '', redirectTo: '/Login', pathMatch: 'full'},
  { 
    path: 'Home', 
    component: HomeComponent,
    canActivate:[AuthGuard]
  },
  { 
    path: 'Soporte',
    component: SoporteComponent,
    canActivate:[AuthGuard],
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

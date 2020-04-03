import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';


import { MatPaginatorIntl, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';
import { getEsPaginatorIntl} from './material/paginator-lang';

import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { HomeComponent } from './componentes/home/home.component';
import { NavbarTopComponent } from './componentes/navbar-top/navbar-top.component';
import { SidenavbarComponent } from './componentes/sidenavbar/sidenavbar.component';
import { SidenavLinkComponent } from './componentes/sidenavbar/sidenav-link/sidenav-link.component';
import { SidenavMenuComponent } from './componentes/sidenavbar/sidenav-menu/sidenav-menu.component';
import { OverlayComponent } from './componentes/overlay/overlay.component';
import { DialogoConfirmacionesComponent } from './componentes/dialogo-confirmaciones/dialogo-confirmaciones.component';
import { SoporteComponent } from './componentes/soporte/soporte/soporte.component';
import { DatePipe } from '@angular/common';
import { OperativoComponent } from './componentes/dashboard/operativo/operativo.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    NavbarTopComponent,
    SidenavbarComponent,
    SidenavLinkComponent,
    SidenavMenuComponent,
    DialogoConfirmacionesComponent,
    OverlayComponent,
    SoporteComponent,
      ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    AppRoutingModule
  ],
  entryComponents: [OverlayComponent, DialogoConfirmacionesComponent],
  providers: [
    {provide: MatPaginatorIntl, useValue: getEsPaginatorIntl()}, 
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {disableClose: true, hasBackdrop: true}},
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

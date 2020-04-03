import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { element } from 'protractor';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenavbar',
  templateUrl: './sidenavbar.component.html',
  styleUrls: ['./sidenavbar.component.scss']
})
export class SidenavbarComponent implements OnInit {

  secactive: any;
  active: boolean;
  menu = [];
  @Input() parent: MatSidenav;
  @Input() wid: number;

  constructor() {}


  findMenus()
  {
    let menus = JSON.parse(localStorage['Menus']);
    localStorage.removeItem('Menus')

    for(let i = 0; i < menus.length; i++)
    {
      //Dashboard
       if(menus[i].Nombre == "DASHBOARD")
       {
        this.menu.push(
          {
            name: 'Dashboard',
            state: '/Dashboard',
            type: 'toggle',
            icon: 'far fa-columns',
            pages: []
          } );
          
         for(let sub = 0; sub < menus[i].Submenus.length; sub++)
         {
           if(menus[i].Submenus[sub].nombre == 'General')
           {
             this.menu[i].pages.push(
              {
                name: 'General',
                type: 'link',
                state: '/Dashboard/General',
                icon: 'far fa-users-class'
               });
           }
           if(menus[i].Submenus[sub].nombre == 'Operativo')
           {
             this.menu[i].pages.push(
               {
              name: 'Operativo',
              type: 'link',
              state: '/Dashboard/Operativo',
              icon: 'far fa-cog'
              });
            }
           if(menus[i].Submenus[sub].nombre == 'Administrativo')
           {
             this.menu[i].pages.push(
              {
                name: 'Administrativo',
                type: 'link',
                state: '/Dashboard/Administrativo',
                icon: 'far fa-user-chart'
              });
          }
         }
       }

       //Catalogos
       if(menus[i].Nombre == 'CATALOGO')
       {
        this.menu.push(
          {
            name: "Catálogos",
            state: '/Catalogos',
            type: 'toggle',
            icon: 'far fa-clipboard-list',
            pages:[]
          });
      
        for(let sub = 0; sub < menus[i].Submenus.length; sub++)
        {
          if(menus[i].Submenus[sub].nombre == "Tipos de Estatus")
          {
            this.menu[i].pages.push(
              {
                name: 'Tipos de Estatus',
                type: 'link',
                state: '/Catalogos/TiposEstatus',
                icon: 'far fa-clipboard-check'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Estatus')
          {
            this.menu[i].pages.push(
              {
                name: 'Estatus',
                type: 'link',
                state: '/Catalogos/Estatus',
                icon: 'far fa-toggle-on'  
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Motivos de Estatus')
          {
            this.menu[i].pages.push(
              {
                name: 'Motivos de Estatus',
                type: 'link',
                state: '/Catalogos/MotivosEstatus',
                icon: 'far fa-ballot-check' 
              }) ;
          }
          if(menus[i].Submenus[sub].nombre == 'Tipos de Documentos')
          {
            this.menu[i].pages.push(
              { 
                name: 'Tipos de Documentos',
                type: 'link',
                state: '/Catalogos/TiposDocumentos',
                icon: 'far fa-file-alt'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Tipo de Servicios')
          {
            this.menu[i].pages.push(
              {
                name: 'Tipos de Servicios',
                type: 'link',
                state: '/Catalogos/TiposServicios',
                icon: 'far fa-boxes'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Zonas')
          {
            this.menu[i].pages.push(
              {
                name: 'Zonas',
                type: 'link',
                state: '/Catalogos/Zonas',
                icon: 'far fa-map-marked-alt'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Gastos')
          {
            this.menu[i].pages.push(
              {
                name: 'Gastos',
                type: 'link',
                state: '/Catalogos/Gastos',
                icon: 'far fa-money-check-edit-alt'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Medios')
          {
            this.menu[i].pages.push(
              {
                name: 'Medios',
                type: 'link',
                state: '/Catalogos/Medios',
                icon: 'far fa-dolly'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Equipos')
          {
            this.menu[i].pages.push(
              {
                name: 'Equipos',
                type: 'link',
                state: '/Catalogos/Equipos',
                icon: 'far fa-box'
              });
          }
          if(menus[i].Submenus[sub].nombre =='Formato Actas')
          {
            this.menu[i].pages.push(
              {
                name: 'Formato Actas',
                type: 'link',
                state: '/Catalogos/FormatoActas',
                icon: 'far fa-credit-card-front' 
              });
          }
        }
       }

       //Gastos
       if(menus[i].Nombre == 'GASTOS')
       {
         this.menu.push(
           {
             name: "Gastos",
             state: '/Gastos',
             type: 'toggle',
             icon: 'far fa-dollar-sign',
             pages:[]
          });

        for(let sub = 0; sub < menus[i].Submenus.length; sub++)
        {
         if(menus[i].Submenus[sub].nombre =='Nuevo Gasto')
         {
           this.menu[i].pages.push(
             {
              name: 'Nuevo Gasto',
              type: 'link',
              state: '/Gastos/NuevoGasto',
              icon: 'far fa-money-check-alt'
             });
         }
         if(menus[i].Submenus[sub].nombre =='Seguimiento de Gastos')
         {
           this.menu[i].pages.push(
             {
               name: 'Seguimiento de Gastos',
               type: 'link',
               state: '/Gastos/SeguimientoGastos',
               icon: 'far fa-money-check'
             });
         }
        }
      }
      // Cotizaciones
      if(menus[i].Nombre == 'COTIZACIONES')
       {
        this.menu.push(
          {
            name: "Cotizaciones",
            state: '/Cotizaciones',
            type: 'toggle',
            icon: 'far fa-money-check-alt',
            pages:[]
         });
        for(let sub = 0; sub < menus[i].Submenus.length; sub++)
        {
          if(menus[i].Submenus[sub].nombre == 'Nueva Cotizacion')
          {
            this.menu[i].pages.push(
              {
              name: 'Nueva Cotización',
              type: 'link',
              state: '/Cotizaciones/NuevaCotizacion',
              icon: 'far fa-receipt'
            });
          }
          if(menus[i].Submenus[sub].nombre == 'Seguimiento Cotizaciones')
          {
            this.menu[i].pages.push(
              {
              name: 'Seguimiento Cotizaciones',
              type: 'link',
              state: '/Cotizaciones/SeguimientoCotizaciones',
              icon: 'far fa-clipboard-list-check'
            });
          }
          if(menus[i].Submenus[sub].nombre == 'Reporte General')
          {
            this.menu[i].pages.push(
              {
              name: 'Reporte General',
              type: 'link',
              state: '/Cotizaciones/SeguimientoGenerales',
              icon: 'far fa-clipboard-list-check'
            });
          }
        }
       }
       // Mesa de Control
       if(menus[i].Nombre == 'MESA DE CONTROL')
       {
         this.menu.push(
          {
            name: "Mesa de Control",
            state: '/MesaControl',
            type: 'toggle',
            icon: 'far fa-box-full',
            pages:[]
          });

        for(let sub = 0; sub < menus[i].Submenus.length; sub++)
        {
          if(menus[i].Submenus[sub].nombre == 'Nuevo Servicio')
          {
            this.menu[i].pages.push(
              {
                name: 'Nuevo Servicio',
                type: 'link',
                state: '/MesaControl/NuevoServicio',
                icon: 'far fa-box-alt'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Seguimiento Servicio')
          {
            this.menu[i].pages.push(
              {
                name: 'Seguimiento Servicios',
                type: 'link',
                state: '/MesaControl/SeguimientoServicios',
                icon: 'far fa-box-check'
              });
          }
        }

       }
       //Operaciones
       if(menus[i].Nombre == 'OPERACIONES')
       {
        this.menu.push(
          {
            name: "Operaciones",
            state: '/Operaciones',
            type: 'toggle',
            icon: 'far fa-pallet',
            pages:[]
          });

        for(let sub = 0; sub < menus[i].Submenus.length; sub++)
        {
          if(menus[i].Submenus[sub].nombre == 'Mis Servicios')
          {
            this.menu[i].pages.push(
              {
                name: 'Mis Servicios',
                type: 'link',
                state: '/Operaciones/MisServicios',
                icon: 'far fa-cogs'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Seguimiento Servicios')
          {
            this.menu[i].pages.push(
              {
                name: 'Seguimiento Servicios',
                type: 'link',
                state: '/Operaciones/SeguimientoServicios',
                icon: 'far fa-list-alt'
              });
          }

          if(menus[i].Submenus[sub].nombre == 'Mis Tecnicos')
          {
            this.menu[i].pages.push(
              {
                name: 'Mis Técnicos',
                type: 'link',
                state: '/Operaciones/MisTecnicos',
                icon: 'far fa-address-book'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Armado de Actas')
          {
            this.menu[i].pages.push(
              {
                name: 'Armado de Actas',
                type: 'link',
                state: '/Operaciones/ArmadoActas',
                icon: 'far fa-cabinet-filing'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Mi Calendario')
          {
            this.menu[i].pages.push(
              {
                name: 'Mi Calendario',
                type: 'link',
                state: '/Operaciones/MiCalendario',
                icon: 'far fa-calendar-alt'
              } );
          }
          if(menus[i].Submenus[sub].nombre == 'Calendario General')
          {
            this.menu[i].pages.push(
              {
                name: 'Calendario General',
                type: 'link',
                state: '/Operaciones/CalendarioGeneral',
                icon: 'far fa-calendar-alt'
              });
          }
        }

       }
       // Administracion
       if(menus[i].Nombre == 'ADMINISTRACION')
       {
        this.menu.push(
          {
            name: "Administración",
            state: '/Administracion',
            type: 'toggle',
            icon: 'far fa-chalkboard-teacher',
            pages:[]
          }); 
        for(let sub = 0; sub < menus[i].Submenus.length; sub++)
        {
          if(menus[i].Submenus[sub].nombre == 'Administracion Actas')
          {
            this.menu[i].pages.push(
              {
                name: 'Administración Actas',
                type: 'link',
                state: '/Administracion/AdministracionActas',
                icon: 'far fa-inventory'
            });
          }
          if(menus[i].Submenus[sub].nombre == 'Autorizar Solicitud Actas')
          {
            this.menu[i].pages.push(
              {
                name: 'Autorizar Solicitud Actas',
                type: 'link',
                state: '/Administracion/AutorizacionActas',
                icon: 'far fa-user-check'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Recepcion Actas Operacionales')
          {
            this.menu[i].pages.push(
              {
                name: 'Recepción Actas Operacionales',
                type: 'link',
                state: '/Administracion/RecepcionActasOperacionales',
                icon: 'far fa-inbox-in'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Seguimiento Folios de Servicio')
          {
            this.menu[i].pages.push(
              {
                name: 'Seguimiento Folios de Servicio',
                type: 'link',
                state: '/Administracion/SeguimientoFolios',
                icon: 'far fa-file-invoice'
              });
          }
          if(menus[i].Submenus[sub].nombre == 'Seguimiento Servicio General')
          {
            this.menu[i].pages.push(
              {
                name: 'Seguimiento Servicio General',
                type: 'link',
                state: '/Administracion/SeguimientoServicio',
                icon: 'far fa-file-invoice'
              });
          }
        }
         
       }
        // Reporte
        if(menus[i].Nombre == 'REPORTES')
        {
         this.menu.push(
           {
             name: "Reporte",
             state: '/Reportes',
             type: 'toggle',
             icon: 'far fa-archive',
             pages:[]
           }); 
         for(let sub = 0; sub < menus[i].Submenus.length; sub++)
         {
           if(menus[i].Submenus[sub].nombre == 'Reporte Analitico')
           {
             this.menu[i].pages.push(
               {
                 name: 'Reporte Analitico',
                 type: 'link',
                 state: '/Reportes/ReporteAnalitico',
                 icon: 'far fa-list-alt'
             });
           }
         }
        }
      }
  }

  ngOnInit()
  {
    this.findMenus();
  }

  cambiarActivo = (objActive) => {

    if (objActive !== undefined) {

      if (objActive.list === this.secactive) {

        this.secactive.classList.toggle('oculto');
        this.secactive.classList.toggle('parent-active');

      } else {

        if (this.secactive !== undefined) {

          this.secactive.classList.add('oculto', 'parent-active');
          objActive.list.classList.remove('oculto', 'parent-active');

        } else {
          objActive.list.classList.remove('oculto', 'parent-active');
        }

      }
    }

    this.secactive = objActive.list;
  }

}

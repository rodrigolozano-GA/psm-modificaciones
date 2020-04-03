import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Servicio } from '../../../clases/Operaciones/Servicio';
import { DialogoCitaComponent } from '../dialogo-cita/dialogo-cita.component';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { DialogoHistoricoComponent } from '../dialogo-historico/dialogo-historico.component';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Folio } from 'src/app/clases/MesaControl/Folio';
import { reduce } from 'rxjs/operators';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { ok } from 'assert';


@Component({
  selector: 'app-mis-servicios',
  templateUrl: './mis-servicios.component.html',
  styleUrls: ['./mis-servicios.component.scss']
})
export class MisServiciosComponent implements OnInit {

  ELEMENT_DATA: Folio[] = [
    /*{ id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 3, cita: '20-04-2019', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 5, cita: '20-04-2019', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 3, cita: '', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 10, cita: '', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 3, cita: '20-04-2019', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 40, cita: '20-04-2019', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 3, cita: '', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 10, cita: '20-04-2019', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 3, cita: '', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" },
    { id: 1, servicioId: 1, servicio: "Nombre del servicio 1", folio: 12456789124, dias: 11, cita: '20-04-2019', estatus_Id: 1, estatus_title: "nombre de estatus 1", sucursal: "Nombre de la sucursal", sucursalId: 1, clienteId: 1, cliente: "nombre de cliente", estatus: 0, servicios: [], coordinador: "coordinador", zona: "Centro" }*/
  ]

  displayedColumns: string[] = ['fecha_programada', 'dias', 'folio', 'tiposervicio', 'cliente', 'estatus', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(DialogoInformacionComponent,{static : true}) hijo: DialogoInformacionComponent;
  selection = new SelectionModel<Servicio>(false, [])

  constructor(
    private _dialog: MatDialog,
    private _snack: MatSnackBar,
    private _excelService: ExcelService,
    private _dataService: GeneralService
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.ActualizarTabla();
  }

  busqueda = (filtro: string) => {
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  dialogoFecha = (row: any) => {
    const dialogRef = this._dialog.open(DialogoCitaComponent, {
      panelClass: 'dialog-cita',
      data: { data: row }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.ActualizarTabla();
    });
  }

  dialogoSeguimiento = (row: any) => {
    console.log("Row:" , row);
  
    const dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-seguimiento',
      data: { accion: 0, data: row }
    })

    dialogRef.afterClosed().subscribe(res => {
      this.ActualizarTabla();
    });
  }

  dialogoHistorico = (row: any) => {
    const dialogRef = this._dialog.open(DialogoHistoricoComponent, {
      panelClass: 'dialog-historico',
      data: { accion: 1, data: row }
    });

    dialogRef.afterClosed().subscribe(res => {
        this.ActualizarTabla();
    });
  }

  claseDias = (dias) => {
    if (dias < 5) {
      return "verde";
    }

    if (dias < 10) {
      return "amarillo";
    }

    if (dias >= 10) {
      return "rojo";
    }
  }

  exportAsExcel = () => {
    let data: any[] = [];

    if (this.dataSource.filteredData.length == 0) {
      this._snack.open("No existen registros para la descarga", "", {
        panelClass: "snack-validation",
        duration: 2000
      });
      return;
    }

    this.dataSource.filteredData.map(reg => {
      data.push({ "Cita": reg.fecha_programada, "Días": 5, "Folio": reg.folio, "Tipo de Servicio": reg.tiposervicio, "Cliente": reg.cliente +' - '+ reg.sucursal, "Estatus": reg.estatus });
    })

    this._excelService.exportAsExcelFile(data, "MisServicios");
  }

  

  deleteService = (reg) => {
    if(reg.estatus != 'En Proceso')
    {
      return this._snack.open("No se permiten realizar modificaciones con el estatus actual", "", { duration: 8000, panelClass: ["snack-error"] })
    }
    else
    {
      const _dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
      panelClass: 'dialog-confirmaciones',
      data: { title: "Eliminar", text: `¿Está seguro de eliminar el servicio seleccionado?`, cancelAction: "NO", okAction: "SI" }
      });
      _dialogRef.afterClosed().subscribe(res => {
        if (res) {
        //  console.log('rer==>' + JSON.stringify(reg.tiposervicio_id));
          this.eliminarServicio(reg);
        }
      });
    }
   }

   eliminarServicio = (reg: any = null) => {
    let params = { opc: 1,id: reg.id };
   // this.mostrarCarga();
    this._dataService.postData<any[]>("mesaControl/seguimiento/tecnicoFolio/RefaccionesDel", "", params).subscribe(
      data => {
        if(data["SUCCESS"]) {
   //       let params: any = { id: this.datosFolio.id };
   //       this.ObtenerDatos("mesaControl/seguimiento/serviciosFolio", params, 1, 1);
        }
        this._snack.open(data["MESSAGE"], "", { duration: 8000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
      }, 
      error => { 
        console.log(error);
        // this._snack.open("Error al conectarse con el servidor", "", { duration: 8000, panelClass: ["snack-error"] }); this.overlayRef.detach();
       }
    );
  }

  numAct = new Map();
  ActualizarTabla = () => {
    this._dataService.postData<Folio[]>("mesaControl/seguimiento/all", "").subscribe(
      data => {
       
        this.ELEMENT_DATA = data["DATA"];
        this.dataSource.data = this.ELEMENT_DATA;

        this.dataSource.data.forEach(item => {

          let fechafilio = "";
          if(item.fecha_programada) {
            fechafilio = item.fecha_programada.split('/')[1]+'-'+item.fecha_programada.split('/')[0]+'-'+item.fecha_programada.split('/')[2];
            item.dias = Math.ceil(Math.abs(new Date().getTime() - new Date(fechafilio).getTime()) / (24 * 60 * 60 * 1000)) - 1;
          }
        });
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

}

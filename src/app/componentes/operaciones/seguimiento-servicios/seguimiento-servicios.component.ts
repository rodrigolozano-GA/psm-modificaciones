import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Servicio } from '../../../clases/Operaciones/Servicio';

import { DialogoCitaComponent } from '../dialogo-cita/dialogo-cita.component';
import { DialogoHistoricoComponent } from '../dialogo-historico/dialogo-historico.component';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { Folio } from 'src/app/clases/MesaControl/Folio';
import { GeneralService } from 'src/app/servicios/general/general.service';

@Component({
  selector: 'app-seguimiento-servicios',
  templateUrl: './seguimiento-servicios.component.html',
  styleUrls: ['./seguimiento-servicios.component.scss']
})
export class SeguimientoServiciosComponent implements OnInit {


  ELEMENT_DATA: Folio[] = [];

  displayedColumns: string[] = ['fecha_programada', 'dias', 'folio', 'tiposervicio', 'cliente', 'estatus', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Servicio>(false, [])
  sessionData: any;

  constructor(
    private _dialog: MatDialog,
    private _snack: MatSnackBar,
    private _excelService: ExcelService,
    private _dataService: GeneralService
  ) {
    this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 

   }

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
    const dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-seguimiento',
      data: { accion: 1, data: row }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.ActualizarTabla();
    });
  }

  dialogoHistorico = (row: any) => {
    const dialogRef = this._dialog.open(DialogoHistoricoComponent, {
      panelClass: 'dialog-historico',
      data: { data: row }
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
      data.push({ "Cita": reg.fecha_programada, "Días": reg.dias, "Folio": reg.folio, "Tipo de Servicio": reg.tiposervicio, "Cliente": reg.cliente +' - '+ reg.sucursal, "Estatus": reg.estatus });
    })

    this._excelService.exportAsExcelFile(data, "SeguimientoServicios");
  }

  ActualizarTabla = () => {
    let param: any = { usuario_id: this.sessionData.IdUsuario};
    this._dataService.postData<Folio[]>("operaciones/seguimiento/all", "", param).subscribe(
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
        //console.log("listado folios: ", data["DATA"]);
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

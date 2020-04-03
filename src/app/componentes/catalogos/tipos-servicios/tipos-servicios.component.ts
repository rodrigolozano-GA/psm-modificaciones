import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';

import { ExcelService } from '../../../servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';

import { TipoServicio } from '../../../clases/Catalogos/TipoServicio';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';

@Component({
  selector: 'app-tipos-servicios',
  templateUrl: './tipos-servicios.component.html',
  styleUrls: ['./tipos-servicios.component.scss']
})
export class TiposServiciosComponent implements OnInit {

  ELEMENT_DATA: TipoServicio[] = [];
  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  

  selection = new SelectionModel<TipoServicio>(false, [])

  constructor(private _dialog: MatDialog, private _excelService: ExcelService, private _snack: MatSnackBar, private _dataService: GeneralService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.ActualizarTabla();
  }

  dialogoAgregar = () => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Agregar Tipo de Servicio", catalogo: "S", accion: 0 } //0 => Nuevo | 1 => Editar
    });
    _dialogRef.afterClosed().subscribe(res => {
      if (res) { this.ActualizarTabla() }
    })
  }

  dialogEditar = (row) => {
    //console.log(row);

    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Editar Tipo de Servicio", data: row, catalogo: "S", accion: 1 } //0 => Nuevo | 1 => Editar
    });

    _dialogRef.afterClosed().subscribe(res => {
      if (res) { this.ActualizarTabla() }
    })
  }

  toggleEstatus = (row: TipoServicio) => {

    const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
      panelClass: 'dialog-confirmaciones',
      data: { title: "Cambio de estatus", text: `¿Está seguro de cambiar el estatus a ${row.nombre}?`, cancelAction: "No", okAction: "Sí" }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.cambiarEstatus(row);
      } else {
        this.ActualizarTabla();
      }
    })
  }

  busqueda = (filtro: string) => {
    this.dataSource.filter = filtro.trim().toLowerCase();
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
      data.push({ "Tipo de Servicio": reg.nombre, "Estatus": reg.estatus ? 'Activo' : 'Inactivo' });
    })

    this._excelService.exportAsExcelFile(data, "TipoServicios");
  }

  ActualizarTabla = () => {
    this._dataService.postData<TipoServicio>("catalogos/tiposServicios/all", "").subscribe(
      data => {
        this.ELEMENT_DATA = data["DATA"];
        this.dataSource.data = this.ELEMENT_DATA;
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    )
  }

  cambiarEstatus = (registro: TipoServicio) => {

    //console.log(registro);
    this._dataService.postData<any>("catalogos/tiposServicios/del", "", registro).subscribe(
      data => {
        this.ActualizarTabla();
        //console.log(registro);
        this._snack.open("Se ha cambiado correctamente el estatus", "", {
          duration: 2000,
          panelClass: ["snack-ok"]
        })
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    )
  }

}

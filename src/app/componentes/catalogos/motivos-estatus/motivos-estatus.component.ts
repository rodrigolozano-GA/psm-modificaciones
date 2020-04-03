import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';

import { MotivoEstatus } from '../../../clases/Catalogos/MotivoEstatus';

import { ExcelService } from '../../../servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';

import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';

@Component({
  selector: 'app-motivos-estatus',
  templateUrl: './motivos-estatus.component.html',
  styleUrls: ['./motivos-estatus.component.scss']
})
export class MotivosEstatusComponent implements OnInit {

  ELEMENT_DATA: MotivoEstatus[] = [];
  displayedColumns: string[] = ['tipoEstatus', 'estNombre', 'nombre', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<MotivoEstatus>(false, [])

  constructor(private _dialog: MatDialog, private _excelService: ExcelService, private _snack: MatSnackBar, private _dataService: GeneralService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.ActualizarTabla();
  }

  dialogoAgregar = () => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Agregar Motivo de Estatus", catalogo: "ME", accion: 0 } //0 => Nuevo | 1 => Editar
    });

    _dialogRef.afterClosed().subscribe(res => {
      if(res) { this.ActualizarTabla(); }
    });
  }

  dialogEditar = (row) => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Editar Motivo de Estatus", data: row, catalogo: "ME", accion: 1 }
    });

    _dialogRef.afterClosed().subscribe(res => {
      if(res) { this.ActualizarTabla(); }
    });
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
      data.push({"Tipo de Estatus": reg.tipoEstatus, "Estatus":reg.estNombre, "Motivo de Estatus": reg.nombre});
    })

    this._excelService.exportAsExcelFile(data, "MotivoEstatus");
  }

  toggleEstatus = (row: MotivoEstatus) => {
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

  cambiarEstatus = (registro: MotivoEstatus) => {
      this._dataService.postData<any>("catalogos/motivos/del", "", registro).subscribe(
        data => {
          this._snack.open(data.MESSAGE, "", { duration: 2000, panelClass: [data.SUCCESS ? "snack-ok" : "snack-error"] });
        },
        error => {
          this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        }
      )
  }

  ActualizarTabla = () => {
    let data: any = {opc:1, catalogo: ""}
    this._dataService.postData<MotivoEstatus[]>("catalogos/motivos/all", "", data).subscribe(
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
    );
  }

}

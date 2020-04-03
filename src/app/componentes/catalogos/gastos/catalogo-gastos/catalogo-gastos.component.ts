import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoInformacionComponent } from '../../dialogo-informacion/dialogo-informacion.component';

import { ExcelService } from '../../../../servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';

import { Gasto } from '../../../../clases/Catalogos/Gasto';
import { DialogoConfirmacionesComponent } from '../../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { DialogoGastoConceptosComponent } from '../dialogo-gasto-conceptos/dialogo-gasto-conceptos.component';

@Component({
  selector: 'app-catalogo-gastos',
  templateUrl: './catalogo-gastos.component.html',
  styleUrls: ['./catalogo-gastos.component.scss']
})
export class CatalogoGastosComponent implements OnInit {

  ELEMENT_DATA: Gasto[] = [];
  displayedColumns: string[] = ['nombre', 'deducible', 'fechaRegistro', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Gasto>(false, [])

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _excelService: ExcelService, private _dataService: GeneralService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.ActualizarTabla();
  }

  dialogoAgregar = () => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Agregar gasto", catalogo: "G", accion: 0 } //0 => Nuevo | 1 => Editar
    });

    _dialogRef.afterClosed().subscribe(res => {
      if (res) { this.ActualizarTabla(); }
    });

  }

  dialogEditar = (row) => {
    //console.log(row);

    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Editar gasto", data: row, catalogo: "G", accion: 1 }
    });

    _dialogRef.afterClosed().subscribe(res => {
      if (res) { this.ActualizarTabla(); }
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
      data.push({ "Nombre": reg.nombre, "Deducible": reg.deducible ? 'Deducible' : 'No Deducible', "Fecha del Registro": reg.fechaRegistro, "Estatus": reg.estatus ? 'Activo' : 'Inactivo' });
    })

    this._excelService.exportAsExcelFile(data, "Gastos");
  }

  ActualizarTabla = () => {
    this._dataService.postData<Gasto[]>("catalogos/gastos/all", "").subscribe(
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

  toggleEstatus = (row: Gasto) => {
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

  cambiarEstatus = (registro: Gasto) => {
    this._dataService.postData<any>("catalogos/gastos/del", "", registro).subscribe(
      data => {
        this._snack.open(data.MESSAGE, "", { duration: 2000, panelClass: [data.SUCCESS ? "snack-ok" : "snack-error"] }); this.ActualizarTabla();
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    )
  }

  dialogoConceptos = (row: Gasto) => {
    const _dialogRef = this._dialog.open(DialogoGastoConceptosComponent, {
      panelClass: 'dialog-conceptos',
      data: { titulo: "Conceptos asociados", id: row.id } //0 => Nuevo | 1 => Editar
    });

    _dialogRef.afterClosed().subscribe(res => {
      if (res) { this.ActualizarTabla(); }
    });
  }

}

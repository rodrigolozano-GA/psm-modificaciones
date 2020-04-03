import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';

import { ConceptoGasto } from '../../../../clases/Catalogos/Gasto';

import { DialogoInformacionComponent } from '../../dialogo-informacion/dialogo-informacion.component';
import { DialogoConfirmacionesComponent } from 'src/app/componentes/dialogo-confirmaciones/dialogo-confirmaciones.component';

@Component({
  selector: 'app-concepto-gastos',
  templateUrl: './concepto-gastos.component.html',
  styleUrls: ['./concepto-gastos.component.scss']
})
export class ConceptoGastosComponent implements OnInit {
  ELEMENT_DATA: ConceptoGasto[] = [];
  displayedColumns: string[] = ['concepto', 'cantidad', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<ConceptoGasto>(false, [])

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _excelService: ExcelService, private _dataService: GeneralService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.ActualizarTabla();
  }

  busqueda = (filtro: string) => {
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  dialogoAgregar = () => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Agregar concepto de gasto", catalogo: "CG", accion: 0 } //0 => Nuevo | 1 => Editar
    });

    _dialogRef.afterClosed().subscribe(res => {
      if(res) { this.ActualizarTabla(); }
    });
    
  }

  dialogEditar = (row) => {
    //console.log(row);

    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Editar concepto de gasto", data: row, catalogo: "CG", accion: 1 }
    });

    _dialogRef.afterClosed().subscribe(res => {
      if(res) { this.ActualizarTabla(); }
    });
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
      data.push({Nombre: reg.nombre, Cantidad: reg.cantidad, Deducible: reg.deducible ? 'Deducible' : 'No Deducible'  ,Estatus:reg.estatus ? 'Activo' : 'Inactivo'});
    })

    this._excelService.exportAsExcelFile(data, "Gastos");
  }

  ActualizarTabla = () => {
    let params: any = { opc: 1 };
    this._dataService.postData<ConceptoGasto[]>("catalogos/gastosDetalle/all", "", params).subscribe(
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

  toggleEstatus = (row: ConceptoGasto) => {
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

  cambiarEstatus = (registro: ConceptoGasto) => {
    this._dataService.postData<any>("catalogos/gastosDetalle/del", "", registro).subscribe(
        data => {
          this._snack.open(data.MESSAGE, "", { duration: 2000, panelClass: [data.SUCCESS ? "snack-ok" : "snack-error"] }); this.ActualizarTabla();
        },
        error => {
          this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        }
      )
  }

}

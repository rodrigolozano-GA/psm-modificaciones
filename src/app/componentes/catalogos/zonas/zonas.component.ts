import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { ExcelService } from '../../../servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';

import { Zona } from '../../../clases/Catalogos/Zona';

import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';

@Component({
  selector: 'app-zonas',
  templateUrl: './zonas.component.html',
  styleUrls: ['./zonas.component.scss']
})
export class ZonasComponent implements OnInit {
  ELEMENT_DATA: Zona[] = [];
  displayedColumns: string[] = ['tipoServicio', 'nombre', 'coordinador', 'actions'];
  dataListaZonas: Zona[];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Zona>(false, [])

  constructor(private _dialog: MatDialog, private _dataService: GeneralService, private _snack: MatSnackBar, private _excelService: ExcelService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.ActualizarTabla();
  }

  dialogoAgregar = () => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Agregar Zona", catalogo: "Z", accion: 0 } //0 => Nuevo | 1 => Editar
    });

    _dialogRef.afterClosed().subscribe(res => {
      if (res) { this.ActualizarTabla(); }
    });
  }

  dialogEditar = (row) => {
    //console.log(row);

    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Editar Zona", data: row, catalogo: "Z", accion: 1 }
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
      data.push({ "Tipo de Servicio": reg.tipoServicio, "Zona": reg.nombre, "Coordinador": reg.coordinador, "Estatus": reg.estatus ? 'Activo' : 'Inactivo' });
    })
    this._excelService.exportAsExcelFile(data, "Zonas");
  }

  toggleEstatus = (row: Zona) => {
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

  cambiarEstatus = (registro: Zona) => {
    this._dataService.postData<any>("catalogos/zonas/del", "", registro).subscribe(
      data => {
        this._snack.open(data.MESSAGE, "", {
          duration: 2000, panelClass: [data.SUCCESS ? "snack-ok" : "snack-error"]
        });
        this.ActualizarTabla();
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    )
  }

  ActualizarTabla = () => {
    this._dataService.postData<Zona[]>("catalogos/zonas/all", "").subscribe(
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

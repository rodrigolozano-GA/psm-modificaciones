import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';

import { ExcelService } from '../../../servicios/excel/excel.service';

import { TipoDocumento } from '../../../clases/Catalogos/TipoDocumento';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { GeneralService } from 'src/app/servicios/general/general.service';


@Component({
  selector: 'app-tipos-documentos',
  templateUrl: './tipos-documentos.component.html',
  styleUrls: ['./tipos-documentos.component.scss']
})
export class TiposDocumentosComponent implements OnInit {
  
  ELEMENT_DATA: TipoDocumento[] = [];
  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<TipoDocumento>(false, [])

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _dataService: GeneralService, private _excelService: ExcelService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    this.ActualizarTabla();
  }

  dialogoAgregar = () => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Agregar Tipo de documento", catalogo: "D", accion: 0 } //0 => Nuevo | 1 => Editar
    });
    _dialogRef.afterClosed().subscribe(res => {
      if(res) { this.ActualizarTabla(); }
    });
  }

  dialogEditar = (row) => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Editar Tipo de documento", data: row, catalogo: "D", accion: 1 }
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
      data.push({"Tipo de Documento": reg.nombre, "Estatus": reg.estatus ? 'Activo' : 'Inactivo'})
    })
    this._excelService.exportAsExcelFile(data, "TipoDocumentos");
  }

  toggleEstatus = (row: TipoDocumento) => {
    const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
      panelClass: 'dialog-confirmaciones',
      data: { title: "Cambio de estatus", text: `¿Está seguro de cambiar el estatus a ${row.nombre}?`, cancelAction: "No", okAction: "Sí" }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) { this.cambiarEstatus(row); } else { this.ActualizarTabla(); }
    })
  }

  cambiarEstatus = (registro: TipoDocumento) => {
    this._dataService.postData<any>("catalogos/tiposDocumentos/del", "", registro).subscribe(
        data => {
          this._snack.open(data.MESSAGE, "", { duration: 2000, panelClass: [data.SUCCESS ? "snack-ok" : "snack-error"] }); this.ActualizarTabla();
        },
        error => {
          this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        }
      )
  }

  ActualizarTabla = () => {
    this._dataService.postData<TipoDocumento[]>("catalogos/tiposDocumentos/all", "").subscribe(
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

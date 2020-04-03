import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';

import { Coordinador } from 'src/app/clases/Catalogos/Coordinador';

import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';

@Component({
  selector: 'app-coordinadores',
  templateUrl: './coordinadores.component.html',
  styleUrls: ['./coordinadores.component.scss']
})
export class CoordinadoresComponent implements OnInit {

  ELEMENT_DATA: Coordinador[] = [];
  displayedColumns: string[] = ['nombre', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Coordinador>(false, [])
  
  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _dataService: GeneralService, private _excelService: ExcelService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    this.ActualizarTabla();
  }

  dialogoAgregar = () => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Agregar Coordinador" , catalogo: "C", accion: 0} //0 => Nuevo | 1 => Editar
    });
    _dialogRef.afterClosed().subscribe(res => {
      if(res) { this.ActualizarTabla(); }
    });
  }

  dialogEditar = (row) => {
    //console.log(row);

    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-info',
      data: { titulo: "Editar Coordinador", data: row , catalogo: "C", accion: 1}
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
      data.push({NombreCoordinador: reg.nombre, TipoServicio: reg.servicio, estatus: reg.estatus ? 'activo' : 'Inactivo'});
    })

    this._excelService.exportAsExcelFile(data, "coordinadores");
  }

  ActualizarTabla = () => {
    let data: any = {opc:1}
    this._dataService.postData<Coordinador[]>("catalogos/coordinadores/all", "", data).subscribe(
      data => {
        //console.log(data);
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

  toggleEstatus = (row: Coordinador) => {
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

  cambiarEstatus = (registro: Coordinador) => {
    this._dataService.postData<any>("catalogos/coordinadores/del", "", registro).subscribe(
        data => {
          this._snack.open(data.MESSAGE, "", { duration: 2000, panelClass: [data.SUCCESS ? "snack-ok" : "snack-error"]
          });
          this.ActualizarTabla();
        },
        error => {
          this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        }
      )
  }

}

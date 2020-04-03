import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoTecnicoComponent } from '../dialogo-tecnico/dialogo-tecnico.component';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Tecnico } from 'src/app/clases/Operaciones/Tecnico';

/*export interface Tecnico {
  id: number;
  numero: number;
  nEmpleado: number;
  nombre: string;
  apellidoM: string;
  apellidoP: string;
}*/

@Component({
  selector: 'app-mis-tecnicos',
  templateUrl: './mis-tecnicos.component.html',
  styleUrls: ['./mis-tecnicos.component.scss']
})
export class MisTecnicosComponent implements OnInit {

  ELEMENT_DATA: Tecnico[] = [
    /*{ id: 1, nempleado: '123', nombre: "Nombre ", tipo: 0, id_ztt: 1 },
    { id: 2, nempleado: '143', nombre: "Nombre ", tipo: 0, id_ztt: 1 },
    { id: 3, nempleado: '163', nombre: "Nombre ", tipo: 0, id_ztt: 1 },
    { id: 4, nempleado: '183', nombre: "Nombre ", tipo: 0, id_ztt: 1 },
    { id: 5, nempleado: '1213', nombre: "Nombre ", tipo: 0, id_ztt: 1 },
    { id: 6, nempleado: '124', nombre: "Nombre ", tipo: 0, id_ztt: 1 },
    { id: 7, nempleado: '23', nombre: "Nombre ", tipo: 0, id_ztt: 1 },
    { id: 8, nempleado: '823', nombre: "Nombre ", tipo: 0, id_ztt: 1 },*/
  ]

  displayedColumns: string[] = ['numero', 'nEmpleado', 'nombre', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Tecnico>(false, [])
  sessionData: any;

  constructor(
    private _dialog: MatDialog, 
    private _snack: MatSnackBar, 
    private _excelService: ExcelService,
    private _dataService: GeneralService) {
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

  dialogoTecnico = (row) => {
    const dialogRef = this._dialog.open(DialogoTecnicoComponent, {
      panelClass: 'dialog-tecnico',
      data: {tecnico: row, editar: false}
    })
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
      data.push({ "N°": reg.consecutivo, "N° Empleado": reg.nempleado, "Nombre": reg.nombre });
    })

    this._excelService.exportAsExcelFile(data, "MisTecnicos");
  }

  ActualizarTabla = () => {
    //let params: any = { usuario_id: 240 };
    let params: any = { usuario_id: this.sessionData.IdUsuario };
    this._dataService.postData<any[]>("operaciones/misTecnicos/all", "", params).subscribe(
      data => {
        this.ELEMENT_DATA = data["DATA"];
        this.dataSource.data = this.ELEMENT_DATA;
        //console.log("listado tecnicos: ", data["DATA"]);
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

}

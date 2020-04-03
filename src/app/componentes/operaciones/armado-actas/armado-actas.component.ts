import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoEnvioComponent } from '../dialogo-envio/dialogo-envio.component';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Acta } from 'src/app/clases/Administracion/Acta';
/*
export interface Acta {
  id: number;
  numero: number;
  folio: string;
  sucursal: string;
  sucursal_numero: number;
  sucursal_id: number;
  cliente: string;
  cliente_id: number;
}
*/
@Component({
  selector: 'app-armado-actas',
  templateUrl: './armado-actas.component.html',
  styleUrls: ['./armado-actas.component.scss']
})
export class ArmadoActasComponent implements OnInit {

  displayedColumns: string[] = ['select', 'numacta', 'servicio', 'cliente','tipo'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Acta>(true, []);
  sessionData : any;

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

  dialogoEnviar = () => {
    const dialogRef = this._dialog.open(DialogoEnvioComponent, {
      panelClass: 'dialog-reportar',
      data: { actas: this.selection.selected }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.ActualizarTabla();
      }
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
      data.push({ "Número de Acta": reg.numero, "Número de Servicio": reg.folio, "Sucursal": reg.cliente + ' ' + reg.sucursal_numero + ' ' + reg.sucursal });
    })

    this._excelService.exportAsExcelFile(data, "ArmadoActas");
  }

  ActualizarTabla = () => {
    let params: any = {
      usuario_id: this.sessionData.IdUsuario
    };
    this._dataService.postData<any[]>("operaciones/armadoActas/all", "", params).subscribe(
      data => {
        this.selection.clear();
        this.dataSource.data = data["DATA"];
        //console.log(JSON.stringify(data["DATA"]));
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

}

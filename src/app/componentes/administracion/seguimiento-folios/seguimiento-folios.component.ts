import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogoReportarComponent } from '../dialogo-reportar/dialogo-reportar.component';
import { GeneralService } from 'src/app/servicios/general/general.service';

export interface Folio {
  id: number;
  folio: string;
  sucursal_id: number;
  sucursal: string;
  cliente_id: number;
  cliente: string;
}

@Component({
  selector: 'app-seguimiento-folios',
  templateUrl: './seguimiento-folios.component.html',
  styleUrls: ['./seguimiento-folios.component.scss']
})
export class SeguimientoFoliosComponent implements OnInit {

  listaFolios: Folio[] = [];
  displayedColumns: string[] = ['select', 'folio', 'cliente'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Folio>(true, []);

  generalForm: FormGroup;

  constructor(
    private _dialog: MatDialog, private _snack: MatSnackBar,
    private _excelService: ExcelService,
    private _fb: FormBuilder,
    private _dataService: GeneralService
  ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.generalForm = this._fb.group({
      folios: [[]]
    })

    //this.estatusChange();
    this.cargarDatos();
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
      data.push({ "Folio": reg.folio, "Cliente": reg.cliente, "Sucursal": reg.sucursal });
    })

    this._excelService.exportAsExcelFile(data, "SeguimientoFolios");
  }

  estatusChange = () => {
    this.generalForm.get("folios").valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
  }

  cargarDatos = () => {
    this.ActualizarTabla();
  }

  dialogoReportar = () => {
    const dialogRef = this._dialog.open(DialogoReportarComponent, {
      panelClass: 'dialog-reportar',
      data: { folios: this.selection.selected }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.ActualizarTabla();
      }
    });
  }

  ActualizarTabla = () => {
    this._dataService.postData<Folio[]>("administracion/seguimientoFolios/all", "").subscribe(
      data => {
        this.selection.clear();
        this.dataSource.data = data["DATA"];
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

}

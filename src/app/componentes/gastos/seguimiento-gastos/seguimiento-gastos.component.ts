import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoGastoComponent } from '../dialogo-gasto/dialogo-gasto.component';
import { DialogoReportarComponent } from '../dialogo-reportar/dialogo-reportar.component';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general/general.service';

@Component({
  selector: 'app-seguimiento-gastos',
  templateUrl: './seguimiento-gastos.component.html',
  styleUrls: ['./seguimiento-gastos.component.scss']
})
export class SeguimientoGastosComponent implements OnInit {

  dataGastos: any[] = []

  displayedColumns: string[] = ['select', 'folio', 'fecha', 'tipo_gasto', 'empleado', 'estatus', 'actions'];
  dataSource = new MatTableDataSource(this.dataGastos);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, []);

  generalForm: FormGroup;

  constructor(
    private _dialog: MatDialog, private _snack: MatSnackBar,
    private _excelService: ExcelService,
    private _fb: FormBuilder,
    private _dataService: GeneralService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.generalForm = this._fb.group({
      gastos: [[]]
    })

    this.estatusChange();
    this.ActualizarTabla();
  }

  dialogoGasto = (row) => {
    const dialogRef = this._dialog.open(DialogoGastoComponent, {
      panelClass: 'dialog-gasto',
      data: { data: row, action: 1 } 
    });
    
    dialogRef.afterClosed().subscribe(res => {
			if (res.actualiza) {
        this.ActualizarTabla();
			}
    });
  
  }

  dialogoReportar = () => {
    const dialogRef = this._dialog.open(DialogoReportarComponent, {
      panelClass: 'dialog-reportar',
      data: { gastos: this.selection.selected }
    })
    dialogRef.afterClosed().subscribe(res => {
			if (res.actualiza) {
        this.selection.clear();
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
      data.push({ "Folio": reg.folio, "Fecha": reg.fecha, "Tipo de Gasto": reg.tipo_gasto, "Empleado": reg.empleado, "Estatus": reg.estatus });
    })

    this._excelService.exportAsExcelFile(data, "SeguimientoGastos");
  }

  estatusChange = () => {
    this.generalForm.get("gastos").valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
  }

  ActualizarTabla = () => {
    this._dataService.postData<any[]>("gastos/seguimiento/all", "").subscribe(
      data => {
        this.generalForm.patchValue({ gastos: data["DATA"] });
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

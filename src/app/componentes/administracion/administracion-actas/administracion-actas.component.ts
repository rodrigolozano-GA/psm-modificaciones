import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { AdminActa } from 'src/app/clases/Administracion/Acta';
import { DialogoDetalleActasComponent } from '../dialogo-detalle-actas/dialogo-detalle-actas.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-administracion-actas',
  templateUrl: './administracion-actas.component.html',
  styleUrls: ['./administracion-actas.component.scss']
})
export class AdministracionActasComponent implements OnInit {

  ELEMENT_DATA: AdminActa[] = [];
  displayedColumns: string[] = ['empleado', 'formato', 'acta_inicial', 'acta_final', 'comprobadas', 'total', 'estatus', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  ELEMENT_DATA_COMPLETE: AdminActa[] = [];
  dataSourceComplete = new MatTableDataSource(this.ELEMENT_DATA_COMPLETE);

  ELEMENT_DATA_INCOMPLETE: AdminActa[] = [];
  dataSourceIncomplete = new MatTableDataSource(this.ELEMENT_DATA_INCOMPLETE);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  @ViewChild('paginator', { static: true }) paginator: MatPaginator;
  @ViewChild('paginator2', { static: true }) paginator2: MatPaginator;

/*
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator2: MatPaginator;
  */

  selection = new SelectionModel<AdminActa>(false, [])

  generalForm: FormGroup;

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _dataService: GeneralService,
    private _excelService: ExcelService, private _fb: FormBuilder) { }

  ngAfterViewInit() {
    this.dataSourceComplete.paginator = this.paginator;
    this.dataSourceIncomplete.paginator = this.paginator2;
  }

  _setDataSource(indexNumber) {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          !this.dataSourceComplete.paginator ? this.dataSourceComplete.paginator = this.paginator : null;
          break;
        case 1:
          !this.dataSourceIncomplete.paginator ? this.dataSourceIncomplete.paginator = this.paginator2 : null;
      }
    })
  }

  ngOnInit() {
    //this.dataSource.sort = this.sort;
   // this.dataSource.paginator = this.paginator;
    this.generalForm = this._fb.group({
      actas: [[]]
    });

    this.estatusChange();
    this.ActualizarTabla();
  }

  busqueda = (filtro: string, opc: any) => {
    switch(opc)
    {
      case 1:{ this.dataSourceComplete.filter = filtro.trim().toLowerCase();}break;
      case 2:{ this.dataSourceIncomplete.filter = filtro.trim().toLocaleLowerCase();}break;
    
    }
    //this.dataSource.filter = filtro.trim().toLowerCase();
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
      data.push({ "Empleado": reg.nombre, "Formato": reg.formato, "Acta Inicial": reg.acta_inicial, "Acta Final": reg.acta_final, "Comprobadas": reg.comprobadas, "Total": reg.total, "Estatus": reg.estatus });
    })

    this._excelService.exportAsExcelFile(data, "Administracion-Actas");
  }

  ActualizarTabla = () => {
    this._dataService.postData<AdminActa[]>("administracion/adminActas/all", "").subscribe(
      data => {
        this.ELEMENT_DATA = data["DATA"];
        this.ELEMENT_DATA_COMPLETE = this.ELEMENT_DATA.filter(data => data.estatus == 'COMPLETO');
        this.ELEMENT_DATA_INCOMPLETE = this.ELEMENT_DATA.filter(data => data.estatus == 'INCOMPLETO');
        this.dataSource.data = this.ELEMENT_DATA;
        this.dataSourceComplete.data = this.ELEMENT_DATA_COMPLETE;
        this.dataSourceIncomplete.data = this.ELEMENT_DATA_INCOMPLETE;
        
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

  dialogoVerDetalle = (row) => {
    const dialog = this._dialog.open(DialogoDetalleActasComponent, {
      panelClass: 'dialog-detalle',
      data: { data: row }
    });
    dialog.afterClosed().subscribe(res => {
      this.ActualizarTabla();
    })
  }

  estatusChange = () => {
    //console.log('Evento.', this.generalForm.get('actas'));
    this.generalForm.get('actas').valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
  }

}

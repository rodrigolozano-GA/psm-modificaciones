import { Component, OnInit, ViewChild } from '@angular/core';
import { ActaPeticion } from 'src/app/clases/Administracion/Acta';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { DialogoCalificarComponent } from '../dialogo-calificar/dialogo-calificar.component';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-autorizar-actas',
  templateUrl: './autorizar-actas.component.html',
  styleUrls: ['./autorizar-actas.component.scss']
})
export class AutorizarActasComponent implements OnInit {

  ELEMENT_DATA: ActaPeticion[] = [];
  displayedColumns: string[] = ['select', 'folio', 'solicitante', 'tecnico', 'formato', 'actas', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<ActaPeticion>(true , [])

  generalForm: FormGroup;

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _dataService: GeneralService,
    private _excelService: ExcelService,
    private _fb: FormBuilder) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.generalForm = this._fb.group({
      actas: [this.ELEMENT_DATA]
    })

    this.estatusChange();
    this.ActualizarTabla();
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
      data.push({ "Folio": reg.folio, "Solicitante": reg.solicitante, "Técnico": reg.tecnico, "Formato": reg.formato, "Número de Actas": reg.actas });
    })

    this._excelService.exportAsExcelFile(data, "Autorizar-Actas");
  }

  dialogoMotivos = (row) => {
    const dialog = this._dialog.open(DialogoCalificarComponent, {
      panelClass: 'dialog-servicios',
      data: { data: [row] }
    });

    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.ActualizarTabla();
      }
    })
  }

  estatusChange = () => {
    this.generalForm.get("actas").valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
  }
  
  ActualizarTabla = () => {
    this._dataService.postData<ActaPeticion[]>("administracion/solicitudesActas/all", "").subscribe(
      data => {
        this.ELEMENT_DATA = data["DATA"];
        this.dataSource.data = this.ELEMENT_DATA;
        //console.log("listado solicitudes por aprobar: ", data["DATA"]);
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }
  
  dialogoCalificar = () => {
    let bolEmpleado = false;
    let bolSolicitante = false;
    let txtEmpleado = "";
    let txtSolicitnte = "";
    this.selection.selected.forEach(item => {
      if(txtEmpleado == "" && txtSolicitnte == "") {
        txtEmpleado = item.tecnico;
        txtSolicitnte = item.solicitante;
      }

      if(txtEmpleado != item.tecnico) { bolEmpleado = true; }
      if(txtSolicitnte != item.solicitante) { bolSolicitante = true; }
    });

    if(bolEmpleado || bolSolicitante) {
      return this._snack.open("Asegúrese de seleccionar el mismo técnico y solicitante", "", { duration: 2000, panelClass: ["snack-error"] });      
    }
    
    const dialog = this._dialog.open(DialogoCalificarComponent, {
      panelClass: 'dialog-detalle',
      data: { data: this.selection.selected }
    });
    
    dialog.afterClosed().subscribe(res => {
      if (res) {
        this.ActualizarTabla();
      }
    })
  }

}

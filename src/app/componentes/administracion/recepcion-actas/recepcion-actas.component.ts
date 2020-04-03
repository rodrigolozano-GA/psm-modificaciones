import { Component, OnInit, ViewChild, ɵConsole } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ActaEnvio, Acta } from 'src/app/clases/Administracion/Acta';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { DialogoDetalleRecepcionComponent } from '../dialogo-detalle-recepcion/dialogo-detalle-recepcion.component';
import { FormGroup, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-recepcion-actas',
  templateUrl: './recepcion-actas.component.html',
  styleUrls: ['./recepcion-actas.component.scss']
})
export class RecepcionActasComponent implements OnInit {

  ELEMENT_DATA: ActaEnvio[] = [];
  displayedColumns: string[] = ['folio_envio', 'persona_envia', 'hora','total_actas','actions'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(DialogoDetalleRecepcionComponent,{static: true}) hijo: DialogoDetalleRecepcionComponent;
  selection = new SelectionModel<ActaEnvio>(false, [])

  generalForm: FormGroup;

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _dataService: GeneralService,
    private _excelService: ExcelService, private _fb: FormBuilder) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.generalForm = this._fb.group({
      actas: [this.ELEMENT_DATA]
    })

    //this.estatusChange();
    this.cargarDatos();
  }

  dialogoVerDetalle = (registro: ActaEnvio) => {
    //console.log("Row a enviar", registro);
    const _dialogRef = this._dialog.open(DialogoDetalleRecepcionComponent, {
      panelClass: 'dialog-info',
      data: { acta: registro }
    });
    _dialogRef.afterClosed().subscribe(res => {
      if (res) { }
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
      data.push({ "Folio de Envío": reg.folio_envio, "Persona quién Envía": reg.persona_envia });
    })

    this._excelService.exportAsExcelFile(data, "Recepcion-Actas");
  }

  cargarDatos = () => {
    this.ActualizarTabla();
  }

  estatusChange = () => {
    this.generalForm.get("actas").valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
  }
  map= new Map(); 
  ActualizarTabla = () => {
    this._dataService.postData<any[]>("administracion/actasEnviadas/all", "").subscribe(
      data => {
        this.dataSource.data = data["DATA"];
        this.dataSource.data.forEach(
          dat => {
            this._dataService.postData<any[]>("administracion/actasEnviadas/detalle","",{paquete_id:dat.id}).subscribe(
              res =>{
                this.map.set(dat.id,res["DATA"].length);
              }
            )
          })
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

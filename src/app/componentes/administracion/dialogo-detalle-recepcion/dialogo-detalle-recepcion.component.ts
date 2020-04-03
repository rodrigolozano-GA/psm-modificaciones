import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Acta, ActaEnvio } from 'src/app/clases/Administracion/Acta';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { finalize } from 'rxjs/operators';
import { DialogoCalificarComponent } from '../dialogo-calificar/dialogo-calificar.component';

@Component({
  selector: 'app-dialogo-detalle-recepcion',
  templateUrl: './dialogo-detalle-recepcion.component.html',
  styleUrls: ['./dialogo-detalle-recepcion.component.scss']
})
export class DialogoDetalleRecepcionComponent implements OnInit {
  displayedColumns: string[] = ['select', 'folio', 'formato', 'sucursal'];
  paqueteActas: any = {};
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<any>(true, [])

  generalForm: FormGroup;

  overlayRef: OverlayRef;

  constructor(private _dialog: MatDialog,
    private _snack: MatSnackBar,
    private _dataService: GeneralService,
    public dialogRef: MatDialogRef<DialogoCalificarComponent>,
    private _excelService: ExcelService,
    private _fb: FormBuilder,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.paqueteActas = this.data.acta;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.generalForm = this._fb.group({
      nombre: [{ value: '', disabled: true }],
      folio_envio: [{ value: '', disabled: true }],
      total: [{ value: '', disabled: true }]
    })
    //console.log("acta: ", this.paqueteActas);
    this.cargarDatos();
  }

  mostrarCarga = () => {
    let config = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically()
    });

    this.overlayRef = this._overlay.create(config);
    this.overlayRef.attach(new ComponentPortal(OverlayComponent));
  }

  estatusChange = () => {
    this.generalForm.get('actas').valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
  }

  cargarDatos = () => {
    this.generalForm.patchValue({
      nombre: this.paqueteActas.usuario,
      folio_envio: this.paqueteActas.folio
    });

    this.mostrarCarga();
    this.ObtenerDatos('administracion/actasEnviadas/detalle', { paquete_id: this.paqueteActas.id });
  }

  ObtenerDatos = (url: string, params: any = null, tipo = 0) => {
    //console.log('Parametros para obtener paquetes de actas: ' + JSON.stringify(params));
    this._dataService.postData<any[]>(url, "", params).subscribe(
      data => {
        this.overlayRef.detach();
        //console.log("datos detalle paquete: ", data["DATA"]);
        this.dataSource.data = data["DATA"];
        this.dataSource.data.forEach( item => {item.estatus = item.estatus ? true: false; });
        this.generalForm.patchValue({ total: this.dataSource.data.length });
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

  guardarActasDetalle = () => {
    const dRef = this._dialog.open(DialogoConfirmacionesComponent, {
      panelClass: 'dialog-confirmaciones',
      data: { title: "Confirmar Actas", text: `¿Está seguro de actualizar Actas seleccionadas?`, cancelAction: "CANCELAR", okAction: "ACEPTAR" }
    })

    dRef.afterClosed().subscribe(res => {
      if (res) {
        this.mostrarCarga();
        this.ActionPost();
      }
    })
  }

  ActionPost = () => {
    let params: any = {};
    let contItemsTtl = 0;
    let contItems = 0;
    let msg = "";
    //console.log('content data modal : ' + JSON.stringify(this.dataSource.data) )
    this.dataSource.data.forEach(element => {
      params.id = element.idacta;
      params.estatus = element.estatus ? 1 : 0;
      //console.log('datos que se envian : ' + JSON.stringify(params));
      this._dataService.postData<any>('administracion/actasRecepcion/confirmar', "", params)
      .pipe(finalize(()=> {
        contItemsTtl++;
        //console.log('contItemsTtl++ :' + contItemsTtl);
        if(contItemsTtl == this.dataSource.data.length) {
          let tipoAlert = true;
          if(contItems != this.dataSource.data.length && contItems != 0) {
            msg = "Algunas Actas no fueron confirmadas correctamente";
          }

          if(contItems == 0) {
            tipoAlert = false;
            msg = "Error al confirmar las Actas";
          }

          this.overlayRef.detach();
          this.dialogRef.close(true);
          this._snack.open(msg, "", { duration: 8000, panelClass: [tipoAlert ? "snack-ok" : "snack-error"] });
        }
      }))
      .subscribe(
        data => { 
          //console.log("data confirmar: ", data);
          if(data["SUCCESS"]) { contItems++; msg = data["MESSAGE"]; } 
        }, 
        error => { contItems = contItems; }
      );
    });
  }

}

import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { DialogoValidacionActaComponent } from '../dialogo-validacion-acta/dialogo-validacion-acta.component';
import { ActaEnvio } from 'src/app/clases/Administracion/Acta';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface ActaValidar {
  acta_id: number;
  consecutivo: number;
  folio: string;
  numacta: number;
  motivo?: string;
  estatus: number;
}

@Component({
  selector: 'app-dialogo-detalle-actas',
  templateUrl: './dialogo-detalle-actas.component.html',
  styleUrls: ['./dialogo-detalle-actas.component.scss']
})
export class DialogoDetalleActasComponent implements OnInit {

  displayedColumns: string[] = ['consecutivo', 'acta', 'folio', 'motivo', 'estatus', 'actions'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<ActaValidar>(false, [])

  generalForm: FormGroup;

  overlayRef: OverlayRef;

  datosSolicitud: any = {};

  constructor(
    private _dialog: MatDialog, 
    private _snack: MatSnackBar, 
    private _overlay: Overlay,
    private _dataService: GeneralService, 
    private _fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.datosSolicitud = this.data.data;
    }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.generalForm = this._fb.group({
      actas: [[]]
    })

    this.statusChange();
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

  dialogoValidar = (row) => {
    let dialogRef = this._dialog.open(DialogoValidacionActaComponent, {
      panelClass: 'dialog-valida',
      data: { data: row }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        //console.log(this.generalForm.value);
        this.cargarDatos();
      }
    })
  }

  cargarDatos = () => {
    let params: any = {};
    params.id = this.datosSolicitud.solicitud_id;
    this.mostrarCarga();
    this.ActualizarTabla('administracion/adminActas/detalleActas/all', 0, params);
  }

  ActualizarTabla(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        this.overlayRef.detach();
        //console.log("detalle actas solicitud: ", data.DATA);
        this.dataSource.data = data.DATA;
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

  statusChange = () => {
    this.generalForm.get('actas').valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
  }

}

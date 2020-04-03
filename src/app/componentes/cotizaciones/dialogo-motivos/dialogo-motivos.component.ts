import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { finalize } from 'rxjs/operators';

export interface MotivosLst {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-dialogo-motivos',
  templateUrl: './dialogo-motivos.component.html',
  styleUrls: ['./dialogo-motivos.component.scss']
})
export class DialogoMotivosComponent implements OnInit {

  motivosList = []

  motivo: number = 0;
  cotizacion_id: number = 0;
  estatus_id: number = 0;
  opc:number = 0;
  // Loader
  overlayRef: OverlayRef;

  constructor(
    public dialogRef: MatDialogRef<DialogoMotivosComponent>,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _overlay: Overlay) {
      this.cotizacion_id = this.data.cotizacion_id;
      this.estatus_id = this.data.estatus_id;
      this.opc = this.data.opcion;
    }

  ngOnInit() {
    this.ActualizarCombo();
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

  ActualizarCombo = () => {
    let params: any = { opc: 11, id: this.estatus_id };
    this._dataService.postData<MotivosLst[]>("catalogos/motivos/combo", "", params).subscribe(
		  data => {
        this.motivosList = data["DATA"];
		  },
		  error => { this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
		  }
		);
	}

  cancelar = () => {
    this.dialogRef.close({btn: false, data: {}});
  }

  guardar = () => {
    if(!this.motivo) {
      return this._snack.open("Seleccione un motivo", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    this.mostrarCarga();
    let param: any = { motivo_id: Object.values(this.motivo)[0], id: this.cotizacion_id};
    this._dataService.postData<any>("cotizaciones/seguimiento/modmotivo", "", param)
    .pipe(
			finalize(() => {
				this.overlayRef.detach();
			})
		).subscribe(
      data => {
        this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
        if (data["SUCCESS"]) {
          this.dialogRef.close({btn: true, data: data});
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

}

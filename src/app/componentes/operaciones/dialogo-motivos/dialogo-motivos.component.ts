import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export class EstatusServicio {
  id: number;
  motivo_id: number;
}

@Component({
  selector: 'app-dialogo-motivos',
  templateUrl: './dialogo-motivos.component.html',
  styleUrls: ['./dialogo-motivos.component.scss']
})
export class DialogoMotivosComponent implements OnInit {

  generalForm: FormGroup;
  estatus = "";
  servicio: EstatusServicio = new EstatusServicio();
  motivosList = [];

  overlayRef: OverlayRef;

  datosFolio: any = {};

  constructor(
    public dialogRef: MatDialogRef<DialogoMotivosComponent>, 
    private _dataService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private _snack: MatSnackBar,
    private _overlay: Overlay
  ) {
    this.estatus = this.data.titulo;
    this.estatus = this.data.titulo;
    this.datosFolio = this.data.data;
    //console.log("datos form: ", this.data.data);
  }

  ngOnInit() {

    this.generalForm = this._fb.group({
      id: [this.servicio.id],
      motivo_id: [this.servicio.motivo_id, [Validators.required]]
    })

    this.generalForm.patchValue({ id: this.data.data.id });
    
    let params: any = {};
    params.estatus_id = this.datosFolio.estatus_id;
    this.ObtenerDatos('mesaControl/seguimiento/estatusMotivoFolio', params);

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

  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  cancelar = () => {
    this.dialogRef.close(false);
  }

  ObtenerDatos = (url: string, params: any = null) => {
    this._dataService.postData<any[]>(url, "", params).subscribe(
      data => {
        this.motivosList = data["DATA"];
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

  guardar = () => {

    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
    } else {
      //Envio al back
      let params: any = {};
      params.id = this.datosFolio.id;
      params.motivo_id = this.generalForm.value.motivo_id;
      this.mostrarCarga();
      this._dataService.postData<any[]>('mesaControl/seguimiento/estatusMotivoFolio/save', "", params).subscribe(
        data => {
          this.overlayRef.detach();
          if(data["SUCCESS"]) {
            //console.log("Valido", this.generalForm.value);
            this.dialogRef.close(true);
          } else {
            this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: ["snack-error"] });
          }
        },
        error => {
          this.overlayRef.detach();
          this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        }
      );
    }
  }

}

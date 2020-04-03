import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  motivosList = [];

  // Loader
  overlayRef: OverlayRef;

  generalForm: FormGroup;

  datosSolicitud: any = {}; 

  sessionData: any;

  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  constructor(
    public dialogRef: MatDialogRef<DialogoMotivosComponent>,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _overlay: Overlay,
    private _fb: FormBuilder) {
      this.datosSolicitud = this.data.data;
      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
  }

  ngOnInit() {
    this.generalForm = this._fb.group({
      motivo_id: ['', [Validators.required]]
    });

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

  cargarDatos = () => {
    let params: any = {};
    params.opc = 11;
    params.id = this.data.estatus_id;
    this.ObtenerCombos('catalogos/motivos/combo', 0, params);
  }

  cancelar = () => {
    this.dialogRef.close({ btn: false, msg: "" });
  }

  guardar = () => {

    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      return;
    }

    this.ActionPost('administracion/motivoSolicitud/save');
  }

  // Consumir servicio para obtener info de inputs, selects, listas, tablas
  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        this.motivosList = data.DATA;
        //console.log("datos: ", data.DATA);
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

  ActionPost = (url: string, tipo: number = 0) => {
    let contItemsTtl = 0;
    let contItems = 0;
    this.mostrarCarga();
    this.datosSolicitud.forEach(element => {
      let params: any = {};
      params.id = this.generalForm.value.motivo_id;
      params.solicitud = element.id;
      params.usuario_id = this.sessionData.IdUsuario;
      params.opc = 2;

      this._dataService.postData<any>(url, "", params)
      .pipe(finalize(() => {
        contItemsTtl++;
        if(contItemsTtl == this.datosSolicitud.length) {
          this.overlayRef.detach();
          if(contItems != this.datosSolicitud.length && contItems != 0) {
            this.dialogRef.close({ btn: true, msg: "Algunas Solicitudes no se guardaron correctamente" });
          }

          if(contItems == 0) {
            this._snack.open("Error al guardar las Solicitudes", "", {
              duration: 2000,
              panelClass: ["snack-error"]
            });
          }

          if(contItems == this.datosSolicitud.length && contItems != 0) {
            this.dialogRef.close({ btn: true, msg: "Se ha guardado el motivo" });
          }
        }
      }))
      .subscribe(
        data => { 
          if(data["SUCCESS"]) { contItems++; } 
        },
        error => { contItems = contItems; }
      );
    });
  }

}


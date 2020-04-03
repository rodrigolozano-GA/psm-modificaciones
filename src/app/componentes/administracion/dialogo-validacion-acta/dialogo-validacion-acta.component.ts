import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

@Component({
  selector: 'app-dialogo-validacion-acta',
  templateUrl: './dialogo-validacion-acta.component.html',
  styleUrls: ['./dialogo-validacion-acta.component.scss']
})
export class DialogoValidacionActaComponent implements OnInit {

  generalForm: FormGroup;

  overlayRef: OverlayRef;

  datosActa: any = {};

  recibida: number;
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  constructor(
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<DialogoValidacionActaComponent>,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    private _dataService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    ) {
      this.datosActa = this.data.data;
      this.recibida =  data.data.recibida; 
    }


  motivosList: any[] = [
    /*{ id: 1, nombre: "Motivo 1" },
    { id: 2, nombre: "Motivo 2" },
    { id: 3, nombre: "Motivo 3" },
    { id: 4, nombre: "Motivo 4" },
    { id: 5, nombre: "Motivo 5" },*/
  ]

  ngOnInit() {

    this.generalForm = this._fb.group({
      id: [''],
      motivo_id: ['', [Validators.required]]
    })

    //console.log(this.data);

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
    this.ObtenerCombos('administracion/adminActas/detalleActas/motivos');
  }

  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        this.motivosList = data.DATA;
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

  validar = () => {
    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      return;
    }

    let params: any = {};
    params.opc = 2;
    params.acta = this.datosActa.acta_id;
    params.motivo = this.generalForm.value.motivo_id;
    //console.log("postValida Acta: ", params);
    this.mostrarCarga();
    this.ActionPost(params, 'administracion/adminActas/validarActa/save');
  }

  ActionPost = (item: any, url: string, tipo: number = 0) => {
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        this.overlayRef.detach();
        if(data["SUCCESS"]) {
          this.dialogRef.close(true);
        }
        this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

}

import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface formatoActa {
  id: number;
  nombre: string;
}

export interface Advertencias {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-dialogo-solicitud-actas',
  templateUrl: './dialogo-solicitud-actas.component.html',
  styleUrls: ['./dialogo-solicitud-actas.component.scss']
})
export class DialogoSolicitudActasComponent implements OnInit {

  formatoActas: formatoActa[] = [];

  adverList: any[] = [
    /*{ id: 1, nombre: "Nombre de la advertencia por motivos motivos motivos motivos" },
    { id: 1, nombre: "Nombre de la advertencia por motivos motivos motivos motivos" },*/
  ];

  formActas: FormGroup;

  overlayRef: OverlayRef;

  datosTecnico: any = {};
  sessionData: any;

  constructor(
    private _fb: FormBuilder,
    public _dialogRef: MatDialogRef<DialogoSolicitudActasComponent>,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    private _dataService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
      this.datosTecnico = this.data.tecnico;
    }

  ngOnInit() {
    this.formActas = this._fb.group({
      formato: ['', [Validators.required]],
      cantidad: ['', [Validators.required]]
    })


    this.ObtenerCombos('catalogos/formatoActas/combo', 1);
  }

  obtAdvertencias = () => {
    //console.log("this.formActas.value.formato: ", this.formActas.value.formato);
    this.ObtenerCombos('operaciones/advertencias/acta', 2, { id: this.datosTecnico.empleado_id, acta: this.formActas.value.formato});
  };

  //Getter general
  generalGetter = (_campo) => {
    return this.formActas.get(_campo);
  }

  solicitar = () => {

    if (!this.formActas.valid) {
      this.formActas.markAllAsTouched();
      return;
    }
    let params: any = {};
    params.empleado = this.datosTecnico.hasOwnProperty("empleado_id") ? this.datosTecnico.empleado_id : this.datosTecnico.id;
    params.cantidad = this.formActas.value.cantidad;
    params.formato_id = this.formActas.value.formato;
    params.solicitante = 0;
    params.usuario_id = this.sessionData.IdUsuario;
    this.mostrarCarga();
    this.ActionPost(params, 'operaciones/misTecnicos/actas/save');
  }

  // Consumir servicio para obtener info de inputs, selects, listas, tablas
  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        switch(tipo){
          case 1: this.formatoActas = data.DATA; break;
          case 2: 
            this.adverList = data.DATA;
            let result = [];
            if(this.adverList.length) {
              if(this.adverList[0].MESSAGE != "") {
                result = this.adverList[0].MESSAGE.split("|");
              }
            }
            this.adverList = result;
          break;
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
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

  ActionPost = (item: any, url: string, tipo: number = 0) => {
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        this.overlayRef.detach();
        if(data["SUCCESS"]) {
          this._dialogRef.close(true);
        }
        this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

}

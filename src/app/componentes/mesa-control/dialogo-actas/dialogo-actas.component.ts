import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { OverlayRef, OverlayConfig, Overlay } from '@angular/cdk/overlay';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface Acta {
  numero: number;
  titulo: string;
  cantidad: number;
}

@Component({
  selector: 'app-dialogo-actas',
  templateUrl: './dialogo-actas.component.html',
  styleUrls: ['./dialogo-actas.component.scss']
})
export class DialogoActasComponent implements OnInit {

  tecnicosList = [];

  formatosList = [];

  actasList: Acta[] = [];
  generalForm: FormGroup;

  overlayRef: OverlayRef;

  datosFolio: any = {};

  constructor(
    public _dialogRef: MatDialogRef<DialogoActasComponent>,
    private _fb: FormBuilder,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.datosFolio = this.data.data;
    //console.log("datos form: ", this.data.data);
  }

  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  ngOnInit() {
    this.generalForm = this._fb.group({
      id: [''],
      formato_id: ['', [Validators.required]],
      tecnico_id: ['', [Validators.required]],
      acta: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    })

    this.generalForm.patchValue({ id: this.data.data.id });

    let params: any = { id: this.datosFolio.id };
    this.ObtenerCombos('mesaControl/seguimiento/tecnicosFolio', 1, params);
    this.mostrarCarga();
    this.ObtenerCombos('catalogos/formatoActas/combo', 2);

    this.estatuschage();
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

  guardar = () => {
    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
    } else {
      let params: any = {};
      params.id = this.datosFolio.id;
      params.acta_id = this.generalForm.value.acta;
      params.descripcion = this.generalForm.value.descripcion;
      //console.log("paramsGuardar Acta-Folio: ", params);
      this.mostrarCarga();
      this._dataService.postData<any[]>('mesaControl/seguimiento/actasFolio/save', "", params).subscribe(
        data => {
          this.overlayRef.detach();
          if (data["SUCCESS"]) {
            this._dialogRef.close(true);
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

  cancelar = () => {
    this._dialogRef.close(false);
  }

  estatuschage = () => {

    this.generalForm.get("tecnico_id").valueChanges.subscribe(reg => {
      if(this.generalForm.value.formato_id != null && this.generalForm.value.formato_id != "") {
        this.generalForm.patchValue({acta: null});
        this.ObtenerCombos('mesaControl/seguimiento/obtActasTecnico', 3, { tecnico_id: reg })
      }
    })
    
    this.generalForm.get("formato_id").valueChanges.subscribe(reg => {
      if(this.generalForm.value.tecnico_id != null && this.generalForm.value.tecnico_id != "") {
        this.generalForm.patchValue({acta: null});
        this.ObtenerCombos('mesaControl/seguimiento/obtActasTecnico', 3,{
            tecnico_id: this.generalForm.get("tecnico_id").value, formato_id: reg
          });
      }      
    })
  }

  // Consumir servicio para obtener info de inputs, selects, listas, tablas
  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        this.overlayRef.detach();
        //console.log("datos: ", data.DATA);
        switch (tipo) {
          case 1:
            //console.log("tecnicos: ", data.DATA);
            this.tecnicosList = data.DATA;
            break;
          case 2:
            //console.log("formatos: ", data.DATA);
            this.formatosList = data.DATA;
            break;
          case 3:
            //console.log("actas: ", data.DATA);
            this.actasList = data.DATA;
            break;

          default:
            break;
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

}

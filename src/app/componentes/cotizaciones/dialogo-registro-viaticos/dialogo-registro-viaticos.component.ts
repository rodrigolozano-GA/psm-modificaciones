import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Viatico } from 'src/app/clases/cotizaciones/Viatico';

@Component({
  selector: 'app-dialogo-registro-viaticos',
  templateUrl: './dialogo-registro-viaticos.component.html',
  styleUrls: ['./dialogo-registro-viaticos.component.scss']
})
export class DialogoRegistroViaticosComponent implements OnInit {

  generalForm: FormGroup;
  trasladosList: [];
  viatico: Viatico = new Viatico();
  origenValido: boolean = true;

  constructor(public _dialogRef: MatDialogRef<DialogoRegistroViaticosComponent>,
    private _FB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.trasladosList = this.data.traslados;
   }

  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  isValid = () => {
    return this.generalForm.valid;
  }

  ngOnInit() {
    this.generalForm = this._FB.group({
      personas: [this.viatico.personas, [Validators.required]],
      dias: [this.viatico.dias, [Validators.required]],
      noches: [this.viatico.noches, [Validators.required]],
      viaticoAlimento: [this.data.viaticoAlimento],
      viaticoHospedaje: [this.data.viaticoHospedaje],
      origen: [this.viatico.origen, [Validators.required]],
      destino: [this.viatico.destino, [Validators.required]],
      origendestino: ['', [Validators.required]]
    })
    //console.log("Traslados", this.trasladosList);
    this.changesDetect();
  }

  registrar = () => {
    if (!this.generalForm.valid) {
      //console.log("no valido:", this.generalForm.value);
      this.generalForm.markAllAsTouched();
      this.origenValido = false;
      //console.log(this.origenValido);
      return;
    }

    this.origenValido = true;
    this._dialogRef.close(this.generalForm.value);
  }

  changesDetect = () => {

    this.generalForm.get("origendestino").valueChanges.subscribe((reg) => {
      //console.log("registro change:", reg);
      this.generalForm.patchValue({ origen: reg.origen });
      this.generalForm.patchValue({ destino: reg.destino });
    })
  }

}

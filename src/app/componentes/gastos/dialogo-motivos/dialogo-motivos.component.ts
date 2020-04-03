import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { GeneralService } from '../../../servicios/general/general.service';

@Component({
	selector: 'app-dialogo-motivos',
	templateUrl: './dialogo-motivos.component.html',
	styleUrls: ['./dialogo-motivos.component.scss']
})
export class DialogoMotivosComponent implements OnInit {

	generalForm: FormGroup;

	motivosList = [];

	overlayRef: OverlayRef;

	constructor(
		public dialogRef: MatDialogRef<DialogoMotivosComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _fb: FormBuilder,
		private _overlay: Overlay,
		private _dataService: GeneralService,
		private _snack: MatSnackBar
	) { }

	ngOnInit() {
		this.generalForm = this._fb.group({
			id: [''],
			motivo_id: ['', [Validators.required]]
		})

		this.generalForm.patchValue({ id: this.data.data.id });
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

	//Getter general
	generalGetter = (_campo) => {
		return this.generalForm.get(_campo);
	}

	cargarDatos = () => {
		this.mostrarCarga();
		// Obtener la lista de Estatus
		this.ObtenerCombos('gastos/seguimiento/motivoGasto/combo', { id: this.data.estatus });
	}

	ObtenerCombos(url: string, params: any = null, tipo = 0) {
		this._dataService.postData<any>(url, "", params)
			.subscribe(
				data => {
					this.overlayRef.detach();
					this.motivosList = data.DATA;
				},
				error => {
					this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
				}
			);
	}

	cancelar = () => {
		this.dialogRef.close(false);
	}

	guardar = () => {
		if (!this.generalForm.valid) {
			this.generalForm.markAllAsTouched();
			this._snack.open("Seleccione un motivo", "", { duration: 2000, panelClass: ["snack-error"] });
		} else {
			//Envio al back
			this.dialogRef.close({accion: true, id: this.generalForm.value.motivo_id});
		}
	}

}

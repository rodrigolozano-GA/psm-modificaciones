import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { GeneralService } from '../../../servicios/general/general.service';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface Folio {
	id: number;
	numero: string;
	monto: number;
}

@Component({
	selector: 'app-dialogo-dividir-monto',
	templateUrl: './dialogo-dividir-monto.component.html',
	styleUrls: ['./dialogo-dividir-monto.component.scss']
})
export class DialogoDividirMontoComponent implements OnInit {

	listFolios: Folio[] = [
		/*{ id: 1, numero: '123456789098', monto: 0 },
		{ id: 2, numero: '123456789098', monto: 0 },*/
	]

	datosMonto: any = {};
	totalMontoSuma: number = 0;
	divideLista: any = [];

	// Loader
	overlayRef: OverlayRef;

	constructor(
		public _dialogRef: MatDialogRef<DialogoDividirMontoComponent>,
		private _snack: MatSnackBar,
		private _dataService: GeneralService,
		private _overlay: Overlay,
		@Inject(MAT_DIALOG_DATA) public data: any) { 
			
			this.datosMonto = this.data.data;
			if(this.datosMonto.hasOwnProperty("registro")) {
				// obtener folios asignados al registro(concepto) con su respectivo monto
				this.listFolios = this.datosMonto.odesLista;
				
				this.mostrarCarga();
				this.ObtenerCombos('gastos/seguimiento/conceptos/detalle', 0, { id: this.datosMonto.registro.id, tipo: 2 });
			} else {
				this.listFolios = this.datosMonto.odesLista;
				if(this.datosMonto.hasOwnProperty("folios")) {
					this.datosMonto.folios.forEach(element => {
						this.listFolios.forEach(element2 => {
							if(element.id == element2.id) {
								//element2.monto = element.monto;
								element2.monto = data.data.MontoTotal/this.listFolios.length;

							}
						});
					});
					this.actualizaCantidad();
				} else {
					this.listFolios.forEach(item => {
						item.monto = 0;
					});
				}
			}
			//console.log("this.datosMonto ", this.datosMonto);
		}

	ngOnInit() {
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

	 // Consumir servicio para obtener info de inputs, selects, listas, tablas
	 ObtenerCombos(url: string, tipo = 0, params: any = null) {
		this._dataService.postData<any>(url, "", params).subscribe(
		  data => {
			this.overlayRef.detach();
			  //console.log("data.DATA folios ", data.DATA);
			  this.datosMonto.folios = data.DATA;
			  this.datosMonto.folios.forEach(element => {
				  	element.monto = element.monto != null && element.monto != "" ? parseFloat(element.monto) : 0;
					this.listFolios.forEach(element2 => {
						if(element.id == element2.id) {
							element2.monto = element.monto;
						}
					});
			});
			this.actualizaCantidad();
		  },
		  error => {
			this.overlayRef.detach();
			this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
		  }
		);
	  }

	actualizaCantidad = () => {
		let expReg = /^\s*(?=.*[0-9])\d*(?:\.\d{1,2})?\s*$/;
		this.totalMontoSuma = 0;
		this.divideLista = [];

		this.listFolios.forEach(item => {
			item.monto = item.monto ? item.monto : 0;
			if(!expReg.test(item.monto+"")) {
				this._snack.open("Verifique que los montos sean válidos", "", { duration: 8000, panelClass: ["snack-error"] });
				return false;
			} else {
				if(item.monto) {
					this.totalMontoSuma += item.monto;
					this.divideLista.push(item);
				}
			}
		});
	}

	guardar = () => {
		if(this.totalMontoSuma != this.datosMonto.MontoTotal) {
			if(this.totalMontoSuma != 0) {
				this._snack.open("El total no coincide con el monto a dividir", "", { duration: 8000, panelClass: ["snack-error"] });
				return false;
			}
		}

		this._dialogRef.close({ accion: true, data: this.divideLista });
	}
	
	cancelar = () => {
		this._dialogRef.close({ accion: true, data: this.divideLista });
	}

}

import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatSort, MatPaginator, MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { GeneralService } from '../../../servicios/general/general.service';
import { finalize } from 'rxjs/operators';

export interface Gasto {
	id: number;
	nombre: string;
	estatus: string;
	empleado: string;
	nempleado: string;
	folio: string;
	fecha: string;
	tipoGasto: string;
}

@Component({
	selector: 'app-dialogo-reportar',
	templateUrl: './dialogo-reportar.component.html',
	styleUrls: ['./dialogo-reportar.component.scss']
})
export class DialogoReportarComponent implements OnInit {

	overlayRef: OverlayRef;
	dataGastos: any[] = [];

	displayedColumns: string[] = ['folio', 'fecha', 'tipoGasto', 'empleado', 'estatus'];
	dataSource = new MatTableDataSource(this.dataGastos);
	selection = new SelectionModel<Gasto>(true, [])

	sessionData: any;

	@ViewChild(MatSort, { static: true }) sort: MatSort;
	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

	constructor(
		private _dataService: GeneralService,
		private _dialog: MatDialog,
		public _dialogRef: MatDialogRef<DialogoReportarComponent>,
		private _overlay: Overlay,
		private _snack: MatSnackBar,
		@Inject(MAT_DIALOG_DATA) public data: any) {
			this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
			this.dataSource.data = this.data.gastos;
	}

	ngOnInit() {
		this.dataSource.sort = this.sort;
		this.dataSource.paginator = this.paginator;
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


	reportar = () => {
		const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
			panelClass: 'dialog-confirmaciones',
			data: { title: "Reportar Gastos", text: `¿Está seguro de Reportar los Gastos Seleccionados?`, cancelAction: "NO REPORTAR", okAction: "REPORTAR" }
		})

		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.ActionPost();
			}
		})
	}

	ActionPost = () => {
		this.mostrarCarga();
    ////////////////////////////////////////////////////////////////////
		//                  Guardar lista de Servicios                    //
		////////////////////////////////////////////////////////////////////

		// banderas para saber si el registro enviado se guardó en base de datos
		let banServicos = 0;

		// contar los registros en la lista del formulario
		let contServicos = 0;
		let varmsg = "";
		this.dataSource.data.forEach(itemServicio => {
			/*********     Guardar Servicios     ****************/
			let detalleParams: any = {id: itemServicio.id, usuario_id: this.sessionData.IdUsuario};
			//console.log("Servicios-detalleParams: ", detalleParams);
			this._dataService.postData<any>('gastos/seguimiento/reportarGasto/save', "", detalleParams).pipe(
				finalize(() => {
					contServicos++;
					if (contServicos == this.dataSource.data.length) {
						if (banServicos != this.dataSource.data.length) {
							varmsg = "Hay problemas para reportar algunos Folios";
						}
						this._snack.open(varmsg, "", { duration: 10000, panelClass: [banServicos ? "snack-ok" : "snack-error"] });

						this.overlayRef.detach();
						this._dialogRef.close({actualiza: true});
					}
				})
			).subscribe(dataS => { if(dataS["SUCCESS"]) { banServicos = banServicos + 1; varmsg = dataS["MESSAGE"]; } }, errorS => { banServicos = banServicos; this.overlayRef.detach(); });
			/***************************************************/
		});
  }

}

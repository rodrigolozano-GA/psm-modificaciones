import { Component, OnInit, Inject } from '@angular/core';
import { Concepto } from 'src/app/clases/Gastos/Concepto';
import { MatTableDataSource, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { DialogoDividirMontoComponent } from '../dialogo-dividir-monto/dialogo-dividir-monto.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { DialogoMotivosComponent } from '../dialogo-motivos/dialogo-motivos.component';
import { Gasto } from 'src/app/clases/Catalogos/Gasto';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { tap, filter, takeUntil, debounceTime, map, delay, finalize } from 'rxjs/operators';
import { ReplaySubject, Subject } from 'rxjs';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface Servicios {
	id: number;
	nombre: string;
	codigo: string;
	cantidad: number;
	costo: number;
}

export interface Folios {
	id: number;
	numero_servicio: number;
	cliente_id: number;
	cliente: string;
	sucursal_id: number;
	sucursal: string;
	servicio_id: number;
	servicio: string;
	equipo_id: number;
	equipo: string;
	estado_id: number;
	estado: string;
	municipio_id: number;
	municipio: string;
}

export class Empleado {
	id: number;
	nombre: string;
	n_empleado: string;

	constructor() { }
}

@Component({
	selector: 'app-dialogo-gasto',
	templateUrl: './dialogo-gasto.component.html',
	styleUrls: ['./dialogo-gasto.component.scss']
})
export class DialogoGastoComponent implements OnInit {
	lat: number = 20.653805;
	lng: number = -103.347631;

	latMark: number = null;
	lngMark: number = null;

	foliosData: Folios[] = [];

	estatusList: any[] = [
		/*{ id: 1, nombre: "Nuevo " },
		{ id: 2, nombre: "Cancelado" },
		{ id: 3, nombre: "Reportado" }*/
	]

	deduciblesData: Concepto[] = [];

	productosList: Servicios[] = []

	conceptosColumns: string[] = ['concepto', 'monto', 'gasto', 'dividido'];
	conceptosDS = new MatTableDataSource(this.deduciblesData);

	odesColumns: string[] = ['folio', 'cliente', 'tipoS', 'estado', 'municipio'];
	odesData = new MatTableDataSource(this.foliosData);
	selectionOdeS = new SelectionModel<Folios>(true, []);

	displayedColumnsServ: string[] = ['codigo', 'concepto', 'cantidad','total'];
	dataSourceServ = new MatTableDataSource<Servicios>(this.productosList);
	selectionServ = new SelectionModel<Servicios>(true, []);

	generalForm: FormGroup;
	gasto: Gasto = new Gasto();
	accion: number = 0;

	actualiza: boolean = false;

	overlayRef: OverlayRef;

	sessionData: any;

	generalGetter = (_campo) => {
		return this.generalForm.get(_campo);
	}
	constructor(
		public _dialogRef: MatDialogRef<DialogoGastoComponent>,
		private _dialog: MatDialog, 
		private _fb: FormBuilder, 
		@Inject(MAT_DIALOG_DATA) public data: any, 
		private _overlay: Overlay, 
		private _dataService: GeneralService, 
		private _snack: MatSnackBar) {
		this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
		if (this.data.action) {
			this.accion = this.data.action;
		}
	}

	ngOnInit() {
		this.generalForm = this._fb.group({
			id: [''],
			folio: [{ value: '', disabled: true }],
			estatus: [this.gasto.estatus, [Validators.required]],
			tipo_gasto: [{ value: '', disabled: true }],
			n_empleado: [{ value: '', disabled: true }],
			nombre_empleado: [{ value: '', disabled: true }],
			odes: [[]],
			descripcion: [{ value: '', disabled: true }],
			productos: [[]],
			conceptos: [[]],
			abono_adeudo: [{ value: '', readonly: true }],
			total_adeudo: [{ value: '', readonly: true }],
			total_depositado: [{ value: '', readonly: true }]
		})

		this.estatusChange();
		this.cargarDatos();

	}

	dialogoDividirGasto = (seleccionado: any) => {
		let listaOdeS = this.generalForm.value.odes;
		listaOdeS.forEach(element => {
			element.monto = element.Monto != null && element.Monto != "" ? parseFloat(element.Monto) : 0;
		});
		const dialogRef = this._dialog.open(DialogoDividirMontoComponent, {
			panelClass: 'dialog-dividir',
			data: { data: {MontoTotal: seleccionado.Monto, odesLista: this.generalForm.value.odes, folios: [], registro: seleccionado} }
		});
	}

	dialogoMotivo = (msg?: string, estatus = 0) => {
		const dialogRef = this._dialog.open(DialogoMotivosComponent, {
			panelClass: 'dialog-motivos',
			data: { titulo: msg, data: this.data.data, estatus: estatus }
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res.accion) {
				this.mostrarCarga();
				this.ActionPost({ id: this.data.data.id, estatus: estatus }, 'gastos/seguimiento/estatusGasto/save', res.id);
			}
		})
	}

	dialogoReportar = (estatus = 0) => {
		const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
			panelClass: 'dialog-confirmaciones',
			data: { title: "Reportar Gasto", text: `¿Está seguro de Reportar el Gasto ?`, cancelAction: "NO REPORTAR", okAction: "REPORTAR" }
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.mostrarCarga();
				this.ActionPost({ id: this.data.data.id, estatus: estatus }, 'gastos/seguimiento/estatusGasto/save')
			}
		});



	}

	dialogos = (item: any) => {

		const dRef = this._dialog.open(DialogoConfirmacionesComponent, {
			panelClass: 'dialog-confirmaciones',
			data: { title: "Cambiar estatus", text: `¿Está seguro de cambiar el estatus?`, cancelAction: "CANCELAR", okAction: "ACEPTAR" }
			});
		
		dRef.afterClosed().subscribe(res => {
			if (res) {
				//Cambio de estatus
				let nombre = item.nombre.toLocaleLowerCase();
				
				switch (nombre) {
					case "cancelado": // Cancelado
						this.dialogoMotivo("Cancelado", item.id);
						break;
					case "reportado": // Reportado
						this.dialogoReportar(item.id);
						
						break;
					default: this.cambiarEstatusGasto(item.id); break;
				}
			} else {
				this.generalForm.patchValue({ estatus: this.data.data.idEstatus });
			}
		});

	
	}

	cambiarEstatusGasto = (estatus = 0) => {
		this.mostrarCarga();
		this.ActionPost({ 
			id: this.data.data.id, 
			estatus: estatus, 
			usuario_id: this.sessionData.IdUsuario}, 'gastos/seguimiento/estatusGasto/save');
	}

	estatusChange = () => {
		
		this.generalForm.get("odes").valueChanges.subscribe(reg => {
			this.odesData.data = reg;
		})

		this.generalForm.get("productos").valueChanges.subscribe(reg => {
			this.dataSourceServ.data = reg;
		})

		this.generalForm.get("conceptos").valueChanges.subscribe(reg => {
			this.conceptosDS.data = reg;
		})
	}

	cargarDatos = () => {

		//Datos generales
		if (this.data.data.lat || this.data.data.long) {
			this.lat = this.data.data.lat;
			this.latMark = this.data.data.lat;
			this.lng = this.data.data.long;
			this.lngMark = this.data.data.long;
		}

		this.mostrarCarga();
		// Obtener la lista de Estatus
		this.ObtenerCombos('gastos/seguimiento/estatus/combo', null, 1);
		// Obtener Ordenes de Servicio;
		this.ObtenerCombos('gastos/seguimiento/servicios', { id: this.data.data.id }, 2);
		// Obtener Lista de productos
		this.ObtenerCombos('gastos/seguimiento/productos', { id: this.data.data.id }, 3);
		// Obtener conceptos de gasto
		this.ObtenerCombos('gastos/seguimiento/conceptos', { id: this.data.data.id }, 4, 1);
		
		// Obtener el detalle del concepto seleccionado
		//this.ObtenerCombos('seguimiento/conceptos', { id: 1 }, 3);

		this.generalForm.patchValue({
			folio: this.data.data.folio,
			tipo_gasto: this.data.data.tipoGasto,
			n_empleado: (this.data.data.nempleado ? this.data.data.nempleado + " - " : "") + this.data.data.empleado,
			nombre_empleado: this.data.data.empleado,
			descripcion: this.data.data.descripcion,
			abono_adeudo: this.data.data.abonoAdeudo,
			total_adeudo: this.data.data.totalAdeudo,
			total_depositado: this.data.data.totalDepositado
		});
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

	cerrar = () => {
		this._dialogRef.close({accion: true, actualiza: this.actualiza});
	}

	ObtenerCombos(url: string, params: any = null, tipo = 0, stoploader = 0) {
		this._dataService.postData<any>(url, "", params)
			.subscribe(
				data => {
					switch (tipo) {
						// Obtener la lista de Estatus
						case 1: this.estatusList = data.DATA; this.generalForm.patchValue({ estatus: this.data.data.idEstatus }); break;
						
						case 2: // Obtener Ordenes de Servicio
							this.generalForm.patchValue({ odes: data.DATA });break;
						case 3: // Obtener la lista de Productos
							this.generalForm.patchValue({ productos: data.DATA });break;
						case 4: // Obtener los Conceptos de Gastos
							let totalGasto = 0;
							data.DATA.forEach(item => {
								totalGasto += parseFloat(item.Monto);
							});

							let ttlAbono = this.generalForm.value.abono_adeudo ? this.generalForm.value.abono_adeudo : 0;
							this.generalForm.patchValue({ conceptos: data.DATA, total_depositado: totalGasto - ttlAbono });break;
					}
					if(stoploader) { this.overlayRef.detach(); }
				},
				error => {
					this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
					if(stoploader) { this.overlayRef.detach(); }
				}
			);
	}

	ActionPost = (item: any, url: string, motivo:number = 0) => {
		this.actualiza = true;
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        if(data["SUCCESS"]) {
					if(motivo) {
							/*********     Guardar Motivo     ****************/
							let respuestaMotivo: any = {};
							let detalleParams: any = {
								id: item.id, 
								motivo: motivo, 
								usuario_id: this.sessionData.IdUsuario };
							//console.log("motivo-detalleParams: ", detalleParams);
							this._dataService.postData<any>('gastos/seguimiento/motivoGasto/save', "", detalleParams).pipe(
								finalize(() => {
									this.overlayRef.detach();
									let msg = "";
									if(respuestaMotivo.hasOwnProperty("MESSAGE")) {
										msg = respuestaMotivo.SUCCESS ? data["MESSAGE"] : data["MESSAGE"] + ". Pero hubo problemas al guardar el motivo";
									} else {
										msg = data["MESSAGE"] + ". Pero hubo problemas al guardar el motivo";
									}
									this._snack.open(msg, "", { duration: 10000, panelClass: ["snack-ok"] });
								})
							).subscribe(dataS => { respuestaMotivo = dataS; 
							    setTimeout(() => {
									this.cerrar();	
								}, 2000);	
								
							}, errorS => { this.overlayRef.detach(); });
							/***************************************************/
					} else {
						this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] }); this.overlayRef.detach();
					}
        } else {
          this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] }); this.overlayRef.detach();
        }
      }, error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }
}

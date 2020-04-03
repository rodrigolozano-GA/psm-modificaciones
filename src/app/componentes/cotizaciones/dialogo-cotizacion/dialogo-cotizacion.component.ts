import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatDialog, MatSnackBar, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoMotivosComponent } from '../dialogo-motivos/dialogo-motivos.component';
import { Cotizacion } from 'src/app/clases/cotizaciones/Cotizacion';
import { GeneralService } from 'src/app/servicios/general/general.service';
import * as pdfGeneral from './../../../funciones/funcionesG';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { finalize } from 'rxjs/operators';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';

export interface Viaticos {
	origen: string;
	destino: string;
	viaticoAlimentos: number;
	viaticoHospedaje: number;
	personas: number;
	dias: number;
	noches: number;
}

export interface Traslados {
	costokm: number;
	origen: string;
	destino: string;
	distancia: number;
	casetas: number;
}

export interface Servicios {
	id: number;
	concepto: string;
	codigo: string;
	cantidad: number;
	precio: number;
}

@Component({
	selector: 'app-dialogo-cotizacion',
	templateUrl: './dialogo-cotizacion.component.html',
	styleUrls: ['./dialogo-cotizacion.component.scss']
})
export class DialogoCotizacionComponent implements OnInit, AfterViewInit {

	SERV_DATA: Servicios[] = [
		//{ id: 1, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, costo: 3250 },
	];

	ELEMENT_DATA: Viaticos[] = [
		//{ origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 1, dias: 3, noches: 2 },
	];

	TRAS_DATA: Traslados[] = [
		//{ costokm: 10, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 50, casetas: 6 },
	];

	estatusList = [
		/*{ id: 1, nombre: "Nuevo" },
		{ id: 2, nombre: "Cancelado" },
		{ id: 3, nombre: "Aprobado" },
		{ id: 4, nombre: "No Aprobado" }*/
	]

	clientesList = [
		//{ id: 1, nombre: "Nombre cliente 1" },
	]

	sucursalesList = [
		//{ id: 1, nombre: "Nombre sucursal 1" },
	]

	tipoServiciosList = [
		//{ id: 1, nombre: "Nombre tipo servicio 1" },
	]

	serviciosList = [
		//{ id: 1, nombre: "Nombre servicio 1" },
	]

	trasladosList = [
		//{ id: 1, costokm: 22.5, origen: "Nombre de origen", destino: "Nombre de destino", distancia: 88, casetas: 7 },
	]

	displayedColumns: string[] = ['origen', 'destino', 'alimentos', 'hospedaje', 'personas', 'dias', 'noches', 'importe'];
	dataSource = new MatTableDataSource(this.ELEMENT_DATA);
	selection = new SelectionModel<Viaticos>(false, [])

	displayedColumnsTras: string[] = ['costo', 'origen', 'destino', 'distancia', 'casetas', 'importe'];
	dataSourceTras = new MatTableDataSource(this.TRAS_DATA);
	selectionTras = new SelectionModel<Traslados>(false, [])

	displayedColumnsServ: string[] = ['codigo', 'concepto', 'cantidad', 'precio', 'importe'];
	dataSourceServ = new MatTableDataSource(this.SERV_DATA);
	selectionServ = new SelectionModel<Servicios>(true, [])

	estatus: number = 0;
	id_estatus: number = 0;
	estatusName: string = "";
	titulo: string = "";

	cotizacion: any = {};

	// Variable para el pdf
	datosPDF: any = {};

	// Loader
	overlayRef: OverlayRef;

	sessionData: any;

	@ViewChild('tableTras', { static: false }) sorts: MatSort;

	constructor(
		public _dialogRef: MatDialogRef<DialogoCotizacionComponent>, private _snack: MatSnackBar, private _dataService: GeneralService,
		private _dialog: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _overlay: Overlay) {
		this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
		
		//Obtener el estatus actual
		this.id_estatus = (data.data).estatus_id
		//Obtener titutlo
		this.titulo = this.data.title;

		// Obtener cotización
		this.cotizacion = this.data.data;

		// Llenar selects
		this.clientesList.push({ id: this.data.data.cliente_id, nombre: this.data.data.cliente });
		this.sucursalesList.push({ id: this.data.data.sucursal_id, nombre: this.data.data.sucursal });
	}

	ngAfterViewInit() {
		

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

	getTotalProductos = () => {
		return this.dataSourceServ.data.map(t => (t.precio * t.cantidad)).reduce((acc, value) => acc + value, 0);
	}

	getTotalTraslados = () => {
		return this.dataSourceTras.data.map(t => (t.costokm * t.distancia)).reduce((acc, value) => acc + value, 0);
	}

	getTotalViaticos = () => {
		return this.dataSource.data.map(t => (((parseFloat(t.viaticoAlimentos + "") + parseFloat(t.viaticoHospedaje + "")) * t.personas) * t.dias)).reduce((acc, value) => acc + value, 0);
	}

	guardarCotizacion = (event) => {
		const dRef = this._dialog.open(DialogoConfirmacionesComponent, {
			panelClass: 'dialog-confirmaciones',
			data: { title: "Cambiar estatus", text: `¿Está seguro de cambiar el estatus?`, cancelAction: "CANCELAR", okAction: "ACEPTAR" }
		  })
	  
		dRef.afterClosed().subscribe(res => {
			if (res) {
				let banMotivo = false;
				this.estatusList.forEach(item => {
					//banMotivo = (this.estatus == item.id && (item.nombre.toLocaleLowerCase() == "cancelado" || item.nombre.toLocaleLowerCase() == "no aprobado")) ? true : banMotivo;
					banMotivo = (this.estatus == item.id && (item.id == 33 || item.id == 35)) ? true : banMotivo;
				});
				if (!banMotivo) {
					this.mostrarCarga();
					this.ActionPost();
					return;
				}
				const dialogRef = this._dialog.open(DialogoMotivosComponent, {
					panelClass: 'dialog-motivos',
					data: {
						cotizacion_id: this.cotizacion.id,
						estatus_id: this.estatus
					}
				});
				dialogRef.afterClosed().subscribe(res => {
					if (res.btn) {
						this.mostrarCarga();
						this.ActionPost(res);
					}
				});
			} else {
				this.estatus = this.cotizacion.estatus_id;
			}
		});
	}

	ActionPost = (respMotivo: any = null) => {
	
		let param: any = { 
			id: this.cotizacion.id, 
			estatus: this.estatus, 
			usuario_id: this.sessionData.IdUsuario };
		this._dataService.postData<any>("cotizaciones/seguimiento/modestatus", "", param)
			.pipe(
				finalize(() => {
					this.overlayRef.detach();
				})
			)
			.subscribe(
				data => {
					let msn = data["MESSAGE"] + (respMotivo != null ? ". " + respMotivo.data.MESSAGE : "");
					this._snack.open(msn, "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
					if (data["SUCCESS"]) {
						this._dialogRef.close(true);
					}
				},
				error => {
					this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
				}
			);
	}

	generarPDF() {

		if (!this.datosPDF.hasOwnProperty("detalleSucursal")) {
			this._snack.open("No se puede generar el PDF", "", { duration: 2000, panelClass: ["snack-error"] });
			return false;
		}
		//console.log("GENERAR PDF.........................");
		let fechalocal = new Date();
		this.datosPDF.fechalocal = this.cotizacion.fechaRegistro;
		//this.datosPDF.detalleSucursal = {};
		//this.datosPDF.detalleSucursal.direccion_fiscal = "Dirección fiscal";
		//this.datosPDF.detalleSucursal.rfc = "X00XXX000000";
		//this.datosPDF.detalleSucursal.no_economico = "123456";
		this.datosPDF.canal = "";
		//this.datosPDF.detalleSucursal.tienda = "BA MEGA DF LA LUNA";
		//this.datosPDF.detalleSucursal.zona = "Zona 1";
		this.datosPDF.razonSocial = this.cotizacion.cliente;
		this.datosPDF.tipoServicio = this.cotizacion.tipoServicio;
		this.datosPDF.tk = "";
		this.datosPDF.ot = "";
		this.datosPDF.folioInt = this.cotizacion.folio;

		this.datosPDF.serviciosList = this.cotizacion.servicios;
		this.datosPDF.trasladosList = this.cotizacion.traslados;
		this.datosPDF.viaticosList = this.cotizacion.viaticos;
		this.datosPDF.viaticoAlimento = this.cotizacion.viaticoAlimento;
		this.datosPDF.viaticoHospedaje = this.cotizacion.viaticoHospedaje;
		this.datosPDF.costokm = this.cotizacion.costokm;
		this.datosPDF.trasladoviaticos = [];
		this.datosPDF.totales = { ttldistancia: 0, ttlcostokm: 0, ttlcasetas: 0, ttlalimentos: 0, ttlhospedaje: 0, ttlpersonas: 0, ttldias: 0, ttlnoches: 0, total: 0 };

		/** Traslados - Viaticos */
		let calalimentos : any  = 0;
        let calhopedaje: any = 0 ;
		this.datosPDF.trasladosList.forEach(etraslado => {
			this.datosPDF.viaticosList.forEach(eviatico => {
				if (etraslado.origen == eviatico.origen && etraslado.destino == eviatico.destino) {
					// Realizar calculos para obtener la cantidad
					let calcosto = pdfGeneral.formatearCarntidad2Dig(this.datosPDF.costokm * etraslado.distancia);
					if(eviatico.viaticoAlimento != 0 || eviatico.dias != 0)
					{
					  calalimentos = pdfGeneral.formatearCarntidad2Dig((eviatico.viaticoAlimentos * eviatico.personas) * eviatico.dias);
					}
					if(eviatico.viaticoHospedaje!= 0 || eviatico.noches !=0)
					{
					  calhopedaje = pdfGeneral.formatearCarntidad2Dig((eviatico.viaticoHospedaje * eviatico.personas) * eviatico.noches);
					}
					//let calalimentos = pdfGeneral.formatearCarntidad2Dig((this.datosPDF.viaticoAlimento * eviatico.personas) * eviatico.dias);
					//let calhopedaje = pdfGeneral.formatearCarntidad2Dig((this.datosPDF.viaticoHospedaje * eviatico.personas) * eviatico.noches);

					// Obtener totales
					this.datosPDF.totales.ttldistancia += (parseFloat(etraslado.distancia) ? parseFloat(etraslado.distancia) : 0);
					this.datosPDF.totales.ttlcostokm += calcosto;
					this.datosPDF.totales.ttlcasetas += etraslado.casetas;
					this.datosPDF.totales.ttlalimentos += calalimentos;
					this.datosPDF.totales.ttlhospedaje += calhopedaje;
					this.datosPDF.totales.ttlpersonas += eviatico.personas;
					this.datosPDF.totales.ttldias += eviatico.dias;
					this.datosPDF.totales.ttlnoches += eviatico.noches;
					this.datosPDF.totales.total += pdfGeneral.formatearCarntidad2Dig(calcosto + calalimentos + calhopedaje);

					// Registros para la descripción de viáticos
					this.datosPDF.trasladoviaticos.push({
						origen: etraslado.origen,
						destino: etraslado.destino,
						distancia: (parseFloat(etraslado.distancia) ? parseFloat(etraslado.distancia) : 0),
						costokm: calcosto,
						casetas: etraslado.casetas,
						alimentos: calalimentos,
						hospedaje: calhopedaje,
						personas: eviatico.personas,
						dias: eviatico.dias,
						noches: eviatico.noches,
						total: pdfGeneral.formatearCarntidad2Dig(calcosto + calalimentos + calhopedaje)
					});
				}
			});
		});
		pdfGeneral.pdfNvaCotizacion(this.datosPDF);
	}

	ngOnInit() {
		this.mostrarCarga();
		let params: any = { opc: 12, id: this.cotizacion.id, estatus_id: this.id_estatus};
		this.ObtCotizacionDetalle("catalogos/estatus/combo", params, 1);
		params.opc = 2;
		this.ObtCotizacionDetalle("cotizaciones/seguimiento/detalleListas", params, 2);
		params.opc = 3;
		this.ObtCotizacionDetalle("cotizaciones/seguimiento/detalleListas", params, 3);
		params.opc = 4;
		this.ObtCotizacionDetalle("cotizaciones/seguimiento/detalleListas", params, 4);
		params.opc = 5;
		params.id = this.cotizacion.sucursal_id;
		this.ObtCotizacionDetalle('cotizaciones/sucursal/detalle', params, 5);
		setTimeout(() => { this.overlayRef.detach(); }, 3000);
	}

	ObtCotizacionDetalle = (url, params, tipo) => {
		this._dataService.postData<any>(url, "", params).subscribe(
			data => {
				switch (tipo) {
					//Estatus
					case 1:
						this.estatusList = data.DATA;
						// Obtener estatus
						this.estatus = this.data.data.estatus_id ? this.data.data.estatus_id : (this.estatusList.length ? this.estatusList[0].id : 0);
						this.estatusList.forEach(item => {
							if(this.estatus == item.id) {
								this.estatusName = item.nombre.toLocaleLowerCase();
							}
						});
						break;
					//Productos/Servicios
					case 2: this.cotizacion.servicios = data.DATA; this.dataSourceServ.data = data.DATA; break;
					//Traslados
					case 3: this.cotizacion.traslados = data.DATA; this.dataSourceTras.data = data.DATA; break;
					//Viáticos
					case 4:
						data.DATA.forEach(element => {
							element.viaticoAlimentos = parseFloat(element.viaticoAlimentos);
							element.viaticoHospedaje = parseFloat(element.viaticoHospedaje);
						});
						this.cotizacion.viaticos = data.DATA; this.dataSource.data = data.DATA; break;
					case 5: this.datosPDF.detalleSucursal = data.DATA.length ? data.DATA[0] : {}; break;
				}
			}, error => {
				this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
			}
		);
	}

}

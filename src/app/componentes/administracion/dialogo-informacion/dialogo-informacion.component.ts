import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { DialogoMotivosComponent } from '../dialogo-motivos/dialogo-motivos.component';
import { MatDialog, MatDialogRef, MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatDatepickerInputEvent, MatSnackBar, MatTabChangeEvent } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
/*
import { DialogoTecnicoComponent } from '../dialogo-tecnico/dialogo-tecnico.component';
import { DialogoSucursalComponent } from '../dialogo-sucursal/dialogo-sucursal.component';
*/
import { Tecnico } from '../../../clases/Operaciones/Tecnico';
import { Documento } from '../../../clases/Operaciones/Documento';
import { Mensaje } from '../../../clases/Operaciones/Mensaje';
import { Actividad } from '../../../clases/Operaciones/Actividad';
import { DialogoAdminTecnicosComponent } from '../dialogo-admin-tecnicos/dialogo-admin-tecnicos.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//import { DialogoActasComponent } from '../dialogo-actas/dialogo-actas.component';
import { Servicio } from 'src/app/clases/Operaciones/Servicio';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { finalize } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { DialogoSeleccionServiciosComponent } from '../dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';
import { DialogoTecnicoComponent } from '../dialogo-tecnico/dialogo-tecnico.component';

export interface Servicios {
  id: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  costo: number;
}

@Component({
  selector: 'app-dialogo-informacion',
  templateUrl: './dialogo-informacion.component.html',
  styleUrls: ['./dialogo-informacion.component.scss']
})
export class DialogoInformacionComponent implements OnInit {

  servicios = [];
  equipos = [];
  coordinadoresList = [];
  clientesList = [];
  sucursalesList = [];
  zonas = [];
  tecnicosList = [];
  estatusList = [];
  documentosList = [];
  actualizacionData: Mensaje[] = [];
  tecnicosData: Tecnico[] = [];
  docsumentosData: Documento[] = [];
  mensajesData: Mensaje[] = [];
  serviciosList: any[] = [];
  actividadData: Actividad[] = [];

  datosFolio: any = {};

  fileData: FormData = new FormData();
  fileName: string = "";

  estatusName: string = "";

  // Variable para almacenar el número de actualizaciones sin leer
  numActualiza: number = 0;

  overlayRef: OverlayRef;
  id_mo : number;
  constructor(
    private _dialog: MatDialog,
    private _dialogRef: MatDialogRef<DialogoInformacionComponent>,
    private _fb: FormBuilder,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.id_mo = data.data.estatus_id;
    this.accion = this.data.accion;
  
    this.datosFolio = this.data.data;
    this.estatusName = this.datosFolio.estatus ? this.datosFolio.estatus.toLocaleLowerCase() : "";
    if(!this.datosFolio.hasOwnProperty("folio")) {
      this.datosFolio.folio = this.data.folio;
    }
  }
 
  tecnColumns: string[] = ['tipo', 'nombre', 'actions'];
  docsColumns: string[] = ['nombre', 'tipo', 'actions'];
  chatColumns: string[] = ['mensaje'];
  actlColumns: string[] = ['descripcion','fecha','hace'];
  displayedColumnsServ: string[] = ['codigo', 'concepto', 'cantidad', 'precio', 'importe', 'empleado', 'actions'];

  dataTecnicos = new MatTableDataSource(this.tecnicosData);
  dataDocumentos = new MatTableDataSource(this.docsumentosData)
  dataActl = new MatTableDataSource(this.actualizacionData);
  dataSourceServ = new MatTableDataSource(this.serviciosList);
  dataActividad = new MatTableDataSource(this.actividadData);

  @ViewChild('tableTecn', { static: true }) sortTecs: MatSort;
  @ViewChild('tableDocs', { static: true }) sortDocs: MatSort;
  @ViewChild('tableActl', { static: true }) sortActl: MatSort;
  @ViewChild('tableActiv', { static: true }) sortActiv: MatSort;
  @ViewChild('tecPaginator', { static: true }) paginatorTecs: MatPaginator;
  @ViewChild('docPaginator', { static: true }) paginatorDocs: MatPaginator;
  @ViewChild('ActlPaginator', { static: true }) paginatorActl: MatPaginator;
  @ViewChild('ActivPaginator', { static: true }) paginatorActiv: MatPaginator;

  servicio: Servicio = new Servicio();

  generalForm: FormGroup;
  panelForm: FormGroup;
  actualizacionForm: FormGroup;
  actualizacionListForm: FormGroup;
  tecnicosForm: FormGroup;
  serviciosForm: FormGroup;
  nuevodocumentoForm: FormGroup;
  documentosForm: FormGroup;
  actividadesForm: FormGroup;

  accion: number = 0;

  visibletc: boolean = false;
  visibleot: boolean = false;
  blopart: BlobPart = null;

  ngOnInit() {
    this.generalForm = this._fb.group({
      id: [this.servicio.id],
      folio: [this.servicio.folio],
      fecha_programada: [this.servicio.fecha_programada],
      estatus: [this.servicio.estatus],
      estatus_id: [this.servicio.estatus_Id]
    })

    this.panelForm = this._fb.group({
      id: [{ value: this.servicio.id, disabled: true }],
      folio: [{ value: this.servicio.folio, disabled: true }],
      actas: [{ value: this.servicio.actas, disabled: true }],
      cliente: [{ value: this.servicio.cliente, disabled: true }],
      sucursal: [{ value: this.servicio.sucursal, disabled: true }],
      servicio: [{ value: this.servicio.servicio, disabled: true }],
      coordinador: [{ value: this.servicio.coordinador, disabled: true }],
      zona: [{ value: this.servicio.zona, disabled: true }],
      ot: [this.servicio.ot],
      tc: [this.servicio.tc]
    })

    this.actualizacionForm = this._fb.group({
      id: [this.servicio.id],
      actualizacion: ['', [Validators.required]]
    })

    this.actualizacionListForm = this._fb.group({
      id: [this.servicio.id],
      actualizacion_list: [[]]
    });

    this.tecnicosForm = this._fb.group({
      id: [this.servicio.id],
      tecnicos: [this.tecnicosList]
    })

    this.serviciosForm = this._fb.group({
      id: [this.servicio.id],
      servicios: [this.servicio.servicios]
    })

    this.documentosForm = this._fb.group({
      id: [this.servicio.id],
      documentos: [[]]
    });

    this.nuevodocumentoForm = this._fb.group({
      tipo: [{ value: ''}, [Validators.required,]],
      documento: ['', [Validators.required]]
    })

    this.actividadesForm = this._fb.group({
      id: [this.servicio.id],
      actividades: [[]]
    });

    this.dataTecnicos.sort = this.sortTecs;
    this.dataTecnicos.paginator = this.paginatorTecs;
    this.dataDocumentos.sort = this.sortDocs;
    this.dataDocumentos.paginator = this.paginatorDocs;
    this.dataActl.sort = this.sortActl;
    this.dataActl.paginator = this.paginatorActl;
    this.dataActividad.sort = this.sortActiv;
    this.dataActividad.paginator = this.paginatorActiv;
    // this.dataSourceServ.data = this.datosFolio.servicios;

    this.estatusChange();
    this.cargarDatos();

  }

  

  dialogoMotivo = (estatus?: string, item: any = null) => {
    const dialogRef = this._dialog.open(DialogoMotivosComponent, {
      panelClass: 'dialog-motivos',
      data: { titulo: estatus, data: this.generalForm.value }
    })
/*
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.actualizaEstatusFolio(item, 3, ". Se ha guardado el motivo");
      }
    })
  }

  */
/*
  dialogoActas = (item: any) => {
    const dialogRef = this._dialog.open(DialogoActasComponent, {
      panelClass: 'dialog-actas',
      data: { data: this.generalForm.value }
    }) */

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.actualizaEstatusFolio(item, 3);
      }
    })
  }
/*
  dialogoAsignacionTecnicos = () => {
    const dialogRef = this._dialog.open(DialogoActasComponent, {
      panelClass: 'dialog-actas',
      data: { data: this.generalForm.value }
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialogRef.close();
      }
    })
  }
*/
/*


  dialogoSucursal = () => {
    if(this.accion == 3){
      return false;
    }
    const _dialogRef = this._dialog.open(DialogoSucursalComponent, {
      panelClass: 'dialog-sucursal',
      data: { data: this.datosFolio }
    })

    _dialogRef.afterClosed().subscribe(res => {

    })
  }
*/

  addServicios = () => {
    if(this.estatusName != 'en proceso' && this.estatusName != 'realizado')
    {
      return this._snack.open("No se permiten realizar modificaciones con el estatus actual", "", { duration: 8000, panelClass: ["snack-error"] });
    }

    const dialogRef = this._dialog.open(DialogoSeleccionServiciosComponent, {
      panelClass: "dialog-servicios",
      data: { data: {cliente_id: this.datosFolio.cliente_id } }
    })

    dialogRef.beforeClosed().subscribe((res) => {
    //  console.log("Servicios", res);
      if (res.length) {
        let list: any[];
        list = this.dataSourceServ.data as any[];

        res.forEach(item => {
          if (!this.existe(item.id)) {
            item.nuevo = 1;
            list.push(item);
          } else {
            list.forEach(element => {
              if(element.id_producto == item.id) {
                element.cantidad = parseFloat(element.cantidad) + parseFloat(item.cantidad);
              }
            });
          }
        });
        this.dataSourceServ.data = [];
        this.dataSourceServ.data = list;

        //this.generalForm.patchValue({ servicios: res });
      }
    });
  };

  //Pendiente de que no se dupliquen los registros :/
  existe = (id: string): boolean => {
    let valido = false;
    this.dataSourceServ.data.map(reg => {
      if (reg.id_producto == id) {
        valido = true;
      }
    })
    return valido;
  }

  deteleFrom = (reg) => {
    if(this.estatusName != 'en proceso' && this.estatusName != 'realizado'){
      return this._snack.open("No se permiten realizar modificaciones con el estatus actual", "", { duration: 8000, panelClass: ["snack-error"] });
    }

    let list: any[];
    let index: any;

    list = this.dataSourceServ.data as any[];
    if(reg.nuevo) {
      index = list.findIndex(local => local.codigo == reg.codigo);
      list.splice(index, 1);
      this.dataSourceServ.data = [];
      this.dataSourceServ.data = list;
    } else {
      // eliminar refacción del folio
      const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
        panelClass: 'dialog-confirmaciones',
        data: { title: "Eliminar", text: `¿Está seguro de eliminar la refacción seleccionada?`, cancelAction: "NO", okAction: "SI" }
      })

      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.eliminarServicio(reg);
        }
      });
    }
  }

  eliminarServicio = (reg: any = null) => {
    let params = { opc: reg.tipo ? 2 : 1, id: reg.id };
    this.mostrarCarga();
    this._dataService.postData<any[]>("mesaControl/seguimiento/tecnicoFolio/RefaccionesDel", "", params).subscribe(
      data => {
        if(data["SUCCESS"]) {
          let params: any = { id: this.datosFolio.id };
          this.ObtenerDatos("mesaControl/seguimiento/serviciosFolio", params, 1, 1);
        }
        this._snack.open(data["MESSAGE"], "", { duration: 8000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
      }, 
      error => { 
        this._snack.open("Error al conectarse con el servidor", "", { duration: 8000, panelClass: ["snack-error"] }); this.overlayRef.detach();
       }
    );
  }

  fileChange = (file: any): void => {
    if(file.target.files.length > 0){
      this.fileName = file.target.files[0].name;
      this.fileData.append('archivoFolio', file.target.files[0], this.fileName);
    }
  }

  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  //Getter general
  ottcGetter = (_campo) => {
    return this.panelForm.get(_campo);
  }

  //Getter general
  actualizacionGetter = (_campo) => {
    return this.actualizacionForm.get(_campo);
  }

  cargarDatos = () => {
    let params: any = { id: this.datosFolio.id };
    this.mostrarCarga();
    this.ObtenerDatos("mesaControl/seguimiento/serviciosFolio", params, 1);
    this.ObtenerDatos("mesaControl/seguimiento/tecnicosFolio", params, 2);
    this.ObtenerDatos("mesaControl/seguimiento/tiposDocumentos", params, 3);
    this.ObtenerDatos("mesaControl/seguimiento/documentosFolio", params, 4);
    params.opc = 14;
    this.ObtenerDatos("catalogos/estatus/combo", params, 5);
    this.ObtenerDatos("mesaControl/seguimiento/actulizacion/obtActualizacionesNum", params, 6);
    this.ObtenerDatos("mesaControl/seguimiento/obtActividades", params, 8);

    //petición de datos
    let temfecha = typeof(this.datosFolio.fecha_programada) == "string" ? this.datosFolio.fecha_programada : formatDate(this.datosFolio.fecha_programada, "dd/MM/yyyy", "en-US");
    temfecha = this.datosFolio.fecha_programada == null ? "" : temfecha;
    if(temfecha != "") {
      temfecha = temfecha.split('/');
      temfecha = temfecha[2] +'/'+ temfecha[1] +'/' + temfecha[0];
      temfecha = new Date(temfecha);
    }

    this.generalForm.patchValue({
      id: this.datosFolio.id,
      folio: this.datosFolio.folio,
      estatus_id: this.datosFolio.estatus_id,
      fecha_programada: temfecha
    }, { emitEvent: false });
    this.panelForm.patchValue({
      id: this.datosFolio.id,
      folio: this.datosFolio.folio,
      ot: this.datosFolio.ot,
      tc: this.datosFolio.ticket,
      cliente: this.datosFolio.cliente,
      sucursal: this.datosFolio.sucursal,
      servicio: this.datosFolio.tiposervicio,
      coordinador: this.datosFolio.coordinador,
      zona: this.datosFolio.zona,
    }, { emitEvent: false });
    this.actualizacionForm.patchValue({ actualizacion: "" }, { emitEvent: false });
  }

  guardarTCOT = () => {
    console.log("General", this.panelForm.value);
  }

  cambioFechaProgramada = (data: MatDatepickerInputEvent<any>) => {
   // this.generalForm.value.fecha_programada = data;
    this.actualizaEstatusFolio(null, 0);
    //this.actualizaEstatusFolio(null, 2, "");
  }

  envioActualizacion = () => {
    if (!this.actualizacionForm.valid) {
      this.actualizacionForm.markAllAsTouched();
      return;
    }

    let params: any = {};
    params.id = this.datosFolio.id;
    params.descripcion = this.actualizacionForm.value.actualizacion;
    this.mostrarCarga();
    this.ActionPost(params, 'mesaControl/seguimiento/actulizacion/save', 4);
  }

  dialogoTecnicos = (titulo?: string, item: any = null) => {
    const _dialogRef = this._dialog.open(DialogoAdminTecnicosComponent, {
      panelClass: 'dialog-tecnico',
      data: { titulo: titulo, id: this.datosFolio.id, zona_id: this.datosFolio.zona_id, datos: this.dataTecnicos.filteredData}
    })

    _dialogRef.afterClosed().subscribe(res => {
      if(res.resultado) {
        // Actualizar estatus
        this.actualizaEstatusFolio(item, 2, res.msg);
      }
    })
  }

  dialogoTecnico = (row: any) => {
    const dialogRef = this._dialog.open(DialogoTecnicoComponent, {
      panelClass: 'dialog-tecnico',
      data: { tecnico: row, folio: this.datosFolio.id, estatusName: this.estatusName }
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res) {
        let params: any = { id: this.datosFolio.id };
        this.ObtenerDatos("mesaControl/seguimiento/serviciosFolio", params, 1);
      }
    })
  }

  subirDoc = () => {
    if (!this.nuevodocumentoForm.valid) {
      this._snack.open("Seleccione un tipo de archivo y el archivo a subir", "", {
        duration: 2000,
        panelClass: ["snack-error"]
      });
      return;
    } else {
      const uploadData = new FormData();
      let params: any = {};
      this.fileData.append('tipoDocumento_id', this.nuevodocumentoForm.value.tipo);
      this.fileData.append('folio_id', this.datosFolio.id);
      this.fileData.append('folio', this.datosFolio.folio);
      params = this.fileData;
      this.mostrarCarga();
      this.ActionPostDoc(params, 'mesaControl/seguimiento/documentos/save', 1);
    }
  }

  estatusChange = () => {
    //Control de cambio de valores

    //Cambio de lista de tecnicos
    this.tecnicosForm.get("tecnicos").valueChanges.subscribe(reg => {
      this.dataTecnicos.data = reg;
    })

    this.serviciosForm.get("servicios").valueChanges.subscribe(reg => {
      this.dataSourceServ.data = reg;
    })

    this.documentosForm.get("documentos").valueChanges.subscribe(reg => {
      this.dataDocumentos.data = reg;
    })

    this.actualizacionListForm.get("actualizacion_list").valueChanges.subscribe(reg => {
      this.dataActl.data = reg;
    })

    this.actividadesForm.get("actividades").valueChanges.subscribe(reg => {
      this.dataActividad.data = reg;
    })
  }

  selectEstatus = (item: any) => {
    const dRef = this._dialog.open(DialogoConfirmacionesComponent, {
			panelClass: 'dialog-confirmaciones',
			data: { title: "Cambiar estatus", text: `¿Está seguro de cambiar el estatus?`, cancelAction: "CANCELAR", okAction: "ACEPTAR" }
		  })
	  
		dRef.afterClosed().subscribe(res => {
			if (res) {
        //Cambio de estatus
        let nombre = item.nombre.toLocaleLowerCase();
        this.estatusName = nombre;

        switch (nombre) {
          case "pendiente": //pendiente
            this.dialogoMotivo("Pendiente", item);
            break;
          case "en proceso": //En Proceso
            //this.dialogoTecnicos("Asignación de Técnicos", item);
            break;
          case "cancelado": //Cancelado
            this.dialogoMotivo("Cancelado", item);
            break;
          case "realizado": //Realizado
          //  this.dialogoActas(item);
            break;

          default: // guardar los estatus restantes
            this.actualizaEstatusFolio(item, 3);
            break;
        }
      } else {
        this.generalForm.patchValue({ estatus_id: this.datosFolio.estatus_id });
      }
    });
  }

  actualizaEstatusFolio = (item: any = null, tipo = 0, msg: string = "") => {
    /*
    if(this.accion == 3){
      return false;
    }
    */
    let params: any = {};
    params.id = this.datosFolio.id;
    params.fecha_programada = this.generalForm.value.hasOwnProperty("fecha_programada") ? this.generalForm.value.fecha_programada : "";
    params.fecha_programada_value = this.generalForm.value.hasOwnProperty("fecha_programada") ? (this.generalForm.value.fecha_programada ? formatDate(this.generalForm.value.fecha_programada, "yyyy/MM/dd", "en-US") : "") : "";
    params.ot = this.panelForm.value.ot;
    params.ticket = this.panelForm.value.tc;
    params.estatus = this.generalForm.value.estatus_id;
    /*if(this.generalForm.value.fecha_programada == null || this.generalForm.value.fecha_programada == ""){
      return this._snack.open("La fecha programada no es válida", "", { duration: 2000, panelClass: ["snack-error"] });
    }*/
    this.mostrarCarga();
    this.ActionPost(params, 'mesaControl/seguimiento/infoGeneralFolio/save', tipo, msg);
  }

  descargarZip = () => {
    let params: any = {};
    params.fol =  this.datosFolio.folio
    this._dataService.postDataZip<any>("mesaControl/seguimiento/documentos/downloadZip", "",params)
    .subscribe(fileData => 
      {
      let b:any = new Blob([fileData], { type: 'application/zip' });
       var url= window.URL.createObjectURL(b);
        window.open(url);
      }
    );
  }

  descargarDocs = (row) => {
    this.mostrarCarga();
    this._dataService.postData<any>("mesaControl/seguimiento/documentos/downloadValidar", "", row).subscribe(
      data => {
        if(data["SUCCESS"]) {
          this._dataService.postDataDocs<any>("mesaControl/seguimiento/documentos/download", "", row).subscribe(
            data => {
              this.overlayRef.detach();
              let dataType = data.type;
              let binaryData = [];
              binaryData.push(data);
              let downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
              downloadLink.setAttribute('download', row.nombre.split('/')[2]);
              document.body.appendChild(downloadLink);
              downloadLink.click();
            },
            error => {
              this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
            }
          );
        } else {
          this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] }); this.overlayRef.detach();
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

  obtActualizaciones = (tabChangeEvent: MatTabChangeEvent, tipo = 0) => {
    let params: any = {};
    params.id = this.datosFolio.id;
    if(tipo != 1) {
      if(tabChangeEvent.tab.textLabel == "Actualización") {
        this.ObtenerDatos('mesaControl/seguimiento/actulizacion/obtActualizaciones', params, 7);
      }
    }
    if(tipo == 1) {
      this.ObtenerDatos('mesaControl/seguimiento/actulizacion/obtActualizaciones', params, 7);
    }
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

  ObtenerDatos = (url: string, params: any = null, tipo = 0, stopLoader = 0) => {
    this._dataService.postData<any[]>(url, "", params).subscribe(
      data => {
        switch(tipo) {
          case 1: this.dataSourceServ.data = data["DATA"]; if(!this.datosFolio.id) { this.dataSourceServ.data = this.datosFolio.servicios; } if(stopLoader) { this.overlayRef.detach(); } break; // Sericios de un folio
          case 2: this.dataTecnicos.data = data["DATA"];  ;break; // Técnicos de una zona
          case 3: this.documentosList = data["DATA"]; break; // Tipos de documentos del sistema
          case 4: this.dataDocumentos.data = data["DATA"]; break; // Documentos de un Folio
          case 5: this.estatusList = data["DATA"]; break; // Estatus para un Folio
          case 6: this.overlayRef.detach(); this.numActualiza = data["DATA"][0].cantidad; break; // Número de Actualizaciones sin leer de un Folio
          case 7: this.overlayRef.detach(); this.dataActl.data = data["DATA"];break; // Lista de Actualizaciones de un Folio
          case 8: this.overlayRef.detach(); this.dataActividad.data = data["DATA"]; break; // Lista de Actividades de un Folio
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        this.overlayRef.detach();
      }
    );
  }

  ActionPost = (item: any, url: string, tipo: number = 0, msg: string = "") => {
    if(!this.dataSourceServ.data.length) {
      return this._snack.open("Agrege por lo menos un producto", "", { duration: 10000, panelClass: ["snack-ok"] });
    }
    let params: any = { id: this.datosFolio.id };
    let countServicios = 0;
    let banServicios = 0;
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        if(data["SUCCESS"]) {
          this._snack.open(data["MESSAGE"]+msg, "", { duration: 2000, panelClass: ["snack-ok"] });
          switch(tipo) {
            case 0:this.overlayRef.detach(); break;
            case 1: // Guardar Documento
              this.overlayRef.detach();
              this.nuevodocumentoForm.patchValue({ tipo: null });
              this.nuevodocumentoForm.patchValue({ documento: null });
              this.fileName = "";
              this.nuevodocumentoForm.reset();
              this.nuevodocumentoForm.clearValidators();
              this.ObtenerDatos("mesaControl/seguimiento/documentosFolio", params, 4);
              this.ObtenerDatos("mesaControl/seguimiento/obtActividades", params, 8);
              break;
            case 2: // Cambiar Motivo y actualizar lista de técnicos
              this.overlayRef.detach();
              this.ObtenerDatos("mesaControl/seguimiento/tecnicosFolio", params, 2);
              this.ObtenerDatos("mesaControl/seguimiento/obtActividades", params, 8);
              break;
            case 3: // Solo cambiar Motivo o datos generales y actualizar la lista de Servicios
                let varmsg = data["MESSAGE"];

                let detalleParams: any = { folio_id: this.datosFolio.id, id: 0, codigo: 0, concepto: 0, precio: 0 };
                if(this.dataSourceServ.data.length){
                  this._snack.open("Guardando Servicios del Folio", "", { duration: 3000, panelClass: ["snack-ok"] });
                }
                this.dataSourceServ.data.forEach(itemServicio => {
                  /*********     Guardar Lista de Servicios     ****************/
                  if(!itemServicio.tipo) {
                    detalleParams.id = itemServicio.id_producto;
                    detalleParams.codigo = itemServicio.codigo;
                    detalleParams.concepto = itemServicio.concepto;
                    detalleParams.precio = itemServicio.precio;
                    detalleParams.cantidad = itemServicio.cantidad;
                    this._dataService.postData<any>('mesaControl/servicios/save', "", detalleParams).pipe(
                      finalize(() => {
                        countServicios++;
                        if (countServicios == this.dataSourceServ.data.length) {
                          this.overlayRef.detach();
                          if (banServicios != this.dataSourceServ.data.length) {
                            varmsg = "Algunos Servicios no se guardaron correctamente";
                          }
                          if (banServicios == this.dataSourceServ.data.length) {
                            varmsg = "Servicios guardados correctamente";
                          }
                          this._snack.open(varmsg, "", { duration: 10000, panelClass: ["snack-ok"] });
                          this._dialogRef.close();
                        }
                      })
                    ).subscribe(
                      dataS => { if(dataS["SUCCESS"]) { banServicios = banServicios + 1; } },
                      errorS => { banServicios = banServicios; this.overlayRef.detach(); }
                    );
                  } else {
                    countServicios++;
                    if (countServicios == this.dataSourceServ.data.length) {
                      this.overlayRef.detach();
                      varmsg = "Servicios guardados correctamente";
                      this._snack.open(varmsg, "", { duration: 10000, panelClass: ["snack-ok"] });
                      this._dialogRef.close();
                    }
                  }
                  /***************************************************/
                });

                if(!this.dataSourceServ.data.length){
                  this.overlayRef.detach();
                  this._dialogRef.close();
                }
              break;
            case 4: this.overlayRef.detach(); this.actualizacionForm.reset(); this.generalForm.clearValidators(); this.obtActualizaciones(null, 1); break;
          }
        } else {
          this._snack.open(data["MESSAGE"]+msg, "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] }); 
          this.overlayRef.detach();
        }
      }, error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

  ActionPostDoc = (item: any, url: string, tipo: number = 0, msg: string = "") => {
    if(!this.dataSourceServ.data.length) {
      return this._snack.open("Agrege por lo menos un producto", "", { duration: 10000, panelClass: ["snack-ok"] });
    }
    let params: any = { id: this.datosFolio.id };
    let countServicios = 0;
    let banServicios = 0;
   // this._dataService.postData<any>(url, "", item).subscribe(
    this._dataService.postFile<any>(url,item).subscribe(
      data => {
        if(data["SUCCESS"]) {
          this._snack.open(data["MESSAGE"]+msg, "", { duration: 2000, panelClass: ["snack-ok"] });
          switch(tipo) {
            case 1: // Guardar Documento
              this.overlayRef.detach();
              this.nuevodocumentoForm.patchValue({ tipo: null });
              this.nuevodocumentoForm.patchValue({ documento: null });
              this.fileName = "";
              this.nuevodocumentoForm.reset();
              this.nuevodocumentoForm.clearValidators();
              this.ObtenerDatos("mesaControl/seguimiento/documentosFolio", params, 4);
              this.ObtenerDatos("mesaControl/seguimiento/obtActividades", params, 8);
              break;
            case 2: // Cambiar Motivo y actualizar lista de técnicos
              this.overlayRef.detach();
              this.ObtenerDatos("mesaControl/seguimiento/tecnicosFolio", params, 2);
              this.ObtenerDatos("mesaControl/seguimiento/obtActividades", params, 8);
              break;
            case 3: // Solo cambiar Motivo o datos generales y actualizar la lista de Servicios
                let varmsg = data["MESSAGE"];

                let detalleParams: any = { folio_id: this.datosFolio.id, id: 0, codigo: 0, concepto: 0, precio: 0 };
                if(this.dataSourceServ.data.length){
                  this._snack.open("Guardando Servicios del Folio", "", { duration: 3000, panelClass: ["snack-ok"] });
                }
                this.dataSourceServ.data.forEach(itemServicio => {
                  /*********     Guardar Lista de Servicios     ****************/
                  if(!itemServicio.tipo) {
                    detalleParams.id = itemServicio.id_producto;
                    detalleParams.codigo = itemServicio.codigo;
                    detalleParams.concepto = itemServicio.concepto;
                    detalleParams.precio = itemServicio.precio;
                    detalleParams.cantidad = itemServicio.cantidad;
                    this._dataService.postData<any>('mesaControl/servicios/save', "", detalleParams).pipe(
                      finalize(() => {
                        countServicios++;
                        if (countServicios == this.dataSourceServ.data.length) {
                          this.overlayRef.detach();
                          if (banServicios != this.dataSourceServ.data.length) {
                            varmsg = "Algunos Servicios no se guardaron correctamente";
                          }
                          if (banServicios == this.dataSourceServ.data.length) {
                            varmsg = "Servicios guardados correctamente";
                          }
                          this._snack.open(varmsg, "", { duration: 10000, panelClass: ["snack-ok"] });
                          this._dialogRef.close();
                        }
                      })
                    ).subscribe(
                      dataS => { if(dataS["SUCCESS"]) { banServicios = banServicios + 1; } },
                      errorS => { banServicios = banServicios; this.overlayRef.detach(); }
                    );
                  } else {
                    countServicios++;
                    if (countServicios == this.dataSourceServ.data.length) {
                      this.overlayRef.detach();
                      varmsg = "Servicios guardados correctamente";
                      this._snack.open(varmsg, "", { duration: 10000, panelClass: ["snack-ok"] });
                      this._dialogRef.close();
                    }
                  }
                  /***************************************************/
                });

                if(!this.dataSourceServ.data.length){
                  this.overlayRef.detach();
                  this._dialogRef.close();
                }
              break;
            case 4: this.overlayRef.detach(); this.actualizacionForm.reset(); this.generalForm.clearValidators(); this.obtActualizaciones(null, 1); break;
          }
        } else {
          this._snack.open(data["MESSAGE"]+msg, "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] }); this.overlayRef.detach();
        }
      }, error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

}

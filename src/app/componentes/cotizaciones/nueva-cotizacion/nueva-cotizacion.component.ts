import { Component, OnInit, Inject, ViewChild, TemplateRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource, MatDialog, MatSnackBar, MatSnackBarConfig, MatSelect } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal} from '@angular/cdk/portal';
import { map, filter, tap, takeUntil, debounceTime, delay, finalize, startWith, take } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { Cotizacion } from '../../../clases/cotizaciones/Cotizacion';
import { formatDate, JsonPipe } from '@angular/common';
import { GeneralService } from 'src/app/servicios/general/general.service';
import * as pdfGeneral from './../../../funciones/funcionesG';

import { DialogoSeleccionServiciosComponent } from '../dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';
import { DialogoRegistroTrasladoComponent } from '../dialogo-registro-traslado/dialogo-registro-traslado.component';
import { DialogoRegistroViaticosComponent } from '../dialogo-registro-viaticos/dialogo-registro-viaticos.component';
import { OverlayComponent } from '../../overlay/overlay.component';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
//import { Sucursal } from '../../mesa-control/dialogo-sucursal/dialogo-sucursal.component';


export interface Viaticos {
  id?: number;
  personas: number;
  dias: number;
  noches: number;
  viaticoAlimentos: number;
  viaticoHospedaje: number;
  origen: string;
  destino: string;
}

const ELEMENT_DATA: Viaticos[] = [/*
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 1, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 2, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 3, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 4, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 5, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 6, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 7, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 8, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 9, dias: 3, noches: 2 },
  { origen: "Nombre del origen", destino: "Nombre del destino", viaticoAlimentos: 500, viaticoHospedaje: 800, personas: 10, dias: 3, noches: 2 }*/
];

export interface Traslados {
  id?: number;
  costokm: number;
  origen: string;
  destino: string;
  distancia: number;
  casetas: number;
}

const TRAS_DATA: Traslados[] = [/*
  { costokm: 10, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 50, casetas: 6 },
  { costokm: 20, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 80, casetas: 6 },
  { costokm: 30, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 30, casetas: 6 },
  { costokm: 40, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 50, casetas: 6 },
  { costokm: 50, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 40, casetas: 6 },
  { costokm: 60, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 50, casetas: 6 },
  { costokm: 70, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 10, casetas: 6 },
  { costokm: 80, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 50, casetas: 6 },
  { costokm: 90, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 50, casetas: 6 },
  { costokm: 100, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 50, casetas: 6 },
  { costokm: 110, origen: "Nombre del origen", destino: "Nombre del destino", distancia: 500, casetas: 6 }*/
];

export interface Servicios {
  id: number;
  concepto: string;
  codigo: string;
  cantidad: number;
  precio: number;
}

const SERV_DATA: Servicios[] = [/*
  { id: 1, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, precio: 3250 },
  { id: 2, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 3, precio: 3250 },
  { id: 3, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 4, precio: 3250 },
  { id: 4, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, precio: 3250 },
  { id: 5, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 2, precio: 3250 },
  { id: 6, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 3, precio: 3250 },
  { id: 7, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, precio: 3250 },
  { id: 8, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, precio: 3250 },
  { id: 9, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, precio: 3250 },
  { id: 10, codigo: "MOCAJ01", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, precio: 3250 }*/
];

export interface Cliente {
  id: number;
  nombre: string;
}

export interface Sucursal {
  id: number;
  nombre: string;
}

export interface Servicio {
  id: number;
  concepto: string;
}

@Component({
  selector: 'app-nueva-cotizacion',
  templateUrl: './nueva-cotizacion.component.html',
  styleUrls: ['./nueva-cotizacion.component.scss']
})
export class NuevaCotizacionComponent implements OnInit {
  cotizacion: Cotizacion = new Cotizacion();

  estatusList = [/*
    { id: 1, nombre: "Nombre estatus 1" },
    { id: 2, nombre: "Nombre estatus 2" },
    { id: 3, nombre: "Nombre estatus 3" },
    { id: 4, nombre: "Nombre estatus 4" },
    { id: 5, nombre: "Nombre estatus 5" },
    { id: 6, nombre: "Nombre estatus 6" },
    { id: 7, nombre: "Nombre estatus 7" }*/
  ]

  clientesList = []

  sucursalesList = []

  tipoServiciosList = [/*
    { id: 1, nombre: "Nombre tipo servicio 1" },
    { id: 2, nombre: "Nombre tipo servicio 2" },
    { id: 3, nombre: "Nombre tipo servicio 3" },
    { id: 4, nombre: "Nombre tipo servicio 4" },
    { id: 5, nombre: "Nombre tipo servicio 5" },
    { id: 6, nombre: "Nombre tipo servicio 6" },
    { id: 7, nombre: "Nombre tipo servicio 7" }*/
  ]

  serviciosList = []

  trasladosList: Traslados[] = [];
  viaticosList: Viaticos[] = [];

  // Variable para el pdf
  datosPDF: any = {};

  //Formulario
  generalForm: FormGroup;
  generalUrl: string = "";
  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  displayedColumns: string[] = ['origen', 'destino', 'alimentos', 'hospedaje', 'personas', 'dias', 'noches', 'importe', 'actions'];
  dataSource = new MatTableDataSource<Viaticos>();
  selection = new SelectionModel<Viaticos>(false, [])

  displayedColumnsTras: string[] = ['costo', 'origen', 'destino', 'distancia', 'casetas', 'costoCasetas', 'importe', 'actions'];
  dataSourceTras = new MatTableDataSource<Traslados>();
  selectionTras = new SelectionModel<Traslados>(false, [])

  displayedColumnsServ: string[] = ['codigo', 'concepto', 'cantidad', 'precio', 'importe', 'actions'];
  dataSourceServ = new MatTableDataSource<Servicios>();
  selectionServ = new SelectionModel<Servicios>(true, [])

  titulo: string = "";
  folio: string = "";
  hoy: string = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");
  objCostos: any = {};

  /** control for the MatSelect filter keyword */
  public clientFilterCtrl: FormControl = new FormControl();

  /** list of banks filtered by search keyword */
  public filteredBanks: ReplaySubject<Cliente[]> = new ReplaySubject<Cliente[]>(1);

  @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;



  /** list of banks */


  /** control for the selected bank for server side filtering */
  public clienteCtrl: FormControl = new FormControl();
  public sucursalCtrl: FormControl = new FormControl();
  public servicioCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public clienteFilteringCtrl: FormControl = new FormControl();
  public sucursalFilteringCtrl: FormControl = new FormControl();
  public servicioFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searching: boolean = false;

  /** list of banks filtered after simulating server side search */
  public filteredClientes: ReplaySubject<Cliente[]> = new ReplaySubject<Cliente[]>(1);
  public filteredSucursales: ReplaySubject<Sucursal[]> = new ReplaySubject<Sucursal[]>(1);
  public filteredServicios: ReplaySubject<Servicio[]> = new ReplaySubject<Servicio[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  overlayRef: OverlayRef;
  mensaje = "";
  sessionData: any;
  constructor(private _dialog: MatDialog,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _fB: FormBuilder,
    private _overlay: Overlay) {
    this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
  }

  ngOnInit() {
    // Listas para el pdf - registros que han sido guardados en la db
    this.datosPDF.serviciosList = [];
    this.datosPDF.trasladosList = [];
    this.datosPDF.viaticosList = [];

    this.generalForm = this._fB.group({
      id: [this.cotizacion.id],
      numero: [this.cotizacion.numero],
      folio: [{ value: this.cotizacion.folio, disabled: true }],
      cliente: [this.cotizacion.cliente],
      cliente_id: [this.cotizacion.cliente_id, [Validators.required]],
      sucursal: [this.cotizacion.sucursal],
      sucursal_id: [this.cotizacion.sucursal_id, [Validators.required]],
      tipoServicio_id: [this.cotizacion.tipoServicio_id, [Validators.required]],
      tipoServicio: [this.cotizacion.tipoServicio],
      servicios: [this.cotizacion.servicios, [Validators.required]],
      costokm: [{ value: this.cotizacion.costokm}, [Validators.required]],
      viaticoAlimento: [{ value: this.cotizacion.viaticoAlimento}, [Validators.required]],
      viaticoHospedaje: [{ value: this.cotizacion.viaticoHospedaje}, [Validators.required]],
      traslados: [this.cotizacion.traslados, [Validators.required]],
      viaticos: [this.cotizacion.viaticos, [Validators.required]],
      pdf: [this.cotizacion.pdf]
    });

    this.formControlValueChanges();
    //this.filtroCliente();

    //this.filtroServicios();
    //this.filtroSucursal();

    // this.ObtenerCombos("/catalogos/tiposServicios/combo",1);
  }

  nuevoProducto = () => {
    if(!this.generalForm.value.cliente_id) {
      return this._snack.open("Seleccione un cliente", "", { duration: 2000, panelClass: ["snack-error"] });
    }

    const dialogRef = this._dialog.open(DialogoSeleccionServiciosComponent, {
      panelClass: "dialog-servicios",
      data: { data: this.generalForm.value }
    })

    dialogRef.beforeClosed().subscribe((res: any[]) => {
      if (res.length) {
        let list: any[];
        this.generalForm.value.servicios == null ? list =[] : list = this.generalForm.value.servicios;      
        res.forEach(item => {
          if (!this.existe(item.id)) {
            list.push(item);
          } else {
            list.forEach(element => {
              if(element.id == item.id) {
                element.cantidad += item.cantidad;
              }
            });
          }
        });
        this.generalForm.patchValue({ servicios: list });
      }
    })
  }

  //Pendiente de que no se dupliquen los registros :/
  existe = (id: number): boolean => {
    let valido = false;
    if(this.dataSourceServ.data.map.length != 0)
    {
      this.dataSourceServ.data.map(reg => {
        if (reg.id == id) {
          valido = true;
        }
      })
    }
  
    return valido;
  }

  registroTraslado = () => {
    let kmcost: number = Number(this.generalForm.get('costokm').value);
    if(isNaN(kmcost))
    {
      return this._snack.open("Ingrese el costo por Km", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    if(kmcost <=0)
    {
      return this._snack.open("El costo por Km debe ser mayor a 0", "", { duration: 2000, panelClass: ["snack-error"] });
    }
  
/*
    if (this.generalForm.get('costokm').value == null || this.generalForm.get('costokm').value == undefined || this.generalForm.get('costokm').value <= 0) {
      return this._snack.open("Ingrese un costo por km", "", { duration: 2000, panelClass: ["snack-error"] });
    }*/
    const dialogRef = this._dialog.open(DialogoRegistroTrasladoComponent, {
      panelClass: "dialog-traslados",
      data: { pcostokm: this.generalForm.get('costokm').value, costoCaseta: this.objCostos.costoCasetas ? parseInt(this.objCostos.costoCasetas + "") : 0 }
    })

    dialogRef.beforeClosed().subscribe((res: Traslados) => {
      if (res) {
        this.trasladosList.push(res);
        this.trasladosList.forEach((item, index) => {
          item.id = index + 1;
        });
        this.generalForm.patchValue({ traslados: this.trasladosList });
      }
    })
  }

  registroViatico = () => {

    let alimento : number = Number(this.generalForm.get('viaticoAlimento').value);
    let hospedaje : number = Number(this.generalForm.get('viaticoHospedaje').value);

    //Validar que exista un traslado
    if(!this.trasladosList.length)
    {
      return this._snack.open("Ingrese un traslado", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    if(isNaN(alimento))
    {
      return this._snack.open("Ingrese el costo de viatico para alimentos", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    if(isNaN(hospedaje))
    {
      return this._snack.open("Ingrese el costo de viatico para hospedaje", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    if(alimento < 0 || hospedaje <0)
    {
      return this._snack.open("Error en la captura de los costos", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    let costoAl = 0;
    let costoHo = 0;
    if(alimento == 0) { costoAl = 0;}else{costoAl = this.generalForm.get('viaticoAlimento').value}
    if(hospedaje == 0){ costoHo = 0;}else{costoHo = this.generalForm.get('viaticoHospedaje').value
    }
    const dialogRef = this._dialog.open(DialogoRegistroViaticosComponent, {
      panelClass: "dialog-viaticos",
      data: {
        traslados: this.trasladosList,
        viaticoAlimento:  costoAl,//this.generalForm.get('viaticoAlimento').value,
        viaticoHospedaje: costoHo//this.generalForm.get('viaticoHospedaje').value
      }
    })

    dialogRef.beforeClosed().subscribe((res: Viaticos) => {
      if (res) {
        this.viaticosList.push(res);
        this.viaticosList.forEach((item, index) => {
          item.id = index + 1;
        });
        this.generalForm.patchValue({ viaticos: this.viaticosList });
      }
    })
  }

  filtroCliente = () => {
    this.clienteFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        startWith(' '),
        map(search => {
          if (!this.clientesList) {
            return [];
          }

          // simulate server fetching and filtering data
          return this.clientesList.filter(cliente => cliente.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredCliente => {
        this.searching = false;
        this.filteredClientes.next(filteredCliente);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });
  }

  filterSuc(args?: any): any {
    let value = this.sucursalesList;
    if(!args)
     return value;
    return value.filter(
      item => {
        item.nombre.toLowerCase().indexOf(((args).toString).toLowerCase) > -1}
   );}

  filtroSucursal = () => {
    this.sucursalFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        startWith(' '),
        map(search => {
          if (!this.sucursalesList) {
            return [];
          }
          // simulate server fetching and filtering data
          return this.sucursalesList.filter(sucursal => sucursal.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredSucursales => {
        this.searching = false;
        this.filteredSucursales.next(filteredSucursales);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });
  }

  filtroServicios = () => {
    this.servicioFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.serviciosList) {
            return [];
          }
          // simulate server fetching and filtering data
          return this.serviciosList.filter(servicio => servicio.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredServicios => {
        this.searching = false;
        this.filteredServicios.next(filteredServicios);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });

  }
  
  
  filtrarPor = (tipo = 0, event) => {
    let params: any = { buscar: event, opc: 0};
    let url = "";
    switch (tipo) {
      case 1: url = 'generales/clientes/combo'; params.opc = 20; break;
      case 2: url = 'generales/sucursales/combo'; params.opc = this.selReg; break;
    }
    this.ObtenerCombos(url, tipo, params);
    
  }

  previsualizar = () => {
    if(this.generalForm.get('cliente_id').value == null || this.generalForm.get('sucursal_id').value == null || 
    this.generalForm.get('tipoServicio_id').value == null)
    {
      this.generalForm.markAllAsTouched();
      this._snack.open("Faltan campos obligatorios", "", { duration: 2000, panelClass: ["snack-error"] });
      return null;
    }
    
    this.previewPDF();

/*
    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      return;
    } else {
      this.previewPDF();
     
    }
    */


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

  generarPdf = () => {
   
    /*if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      this._snack.open("Faltan campos obligatorios", "", { duration: 2000, panelClass: ["snack-error"] });
      return;
    } */
    if(this.generalForm.get('cliente_id').value == null || this.generalForm.get('sucursal_id').value == null || 
        this.generalForm.get('tipoServicio_id').value == null)
    {
      this.generalForm.markAllAsTouched();
      this._snack.open("Faltan campos obligatorios", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    else {
      this.mostrarCarga();
      this.datosPDF.serviciosList = [];
      this.datosPDF.trasladosList = [];
      this.datosPDF.viaticosList = [];
      let parametros = this.generalForm.value;
      parametros.usuario_id = this.sessionData.IdUsuario;
      if(this.generalForm.get('viaticoAlimento').value == 0)
      {
        parametros.viaticoAlimento = 0;
      }
      else
      {
        parametros.viaticoAlimento =  this.generalForm.get('viaticoAlimento').value;
      }
      if(this.generalForm.get('viaticoHospedaje').value == 0)
      {
        parametros.viaticoHospedaje =0;
      }
      else
      {
        parametros.viaticoHospedaje = this.generalForm.get('viaticoHospedaje').value;
      }
               

      if(parametros.traslados == null)
      {
        parametros.traslados = [];
        parametros.viaticoAlimento = 0;
        parametros.viaticoHospedaje =0;
        parametros.viaticos = [];
        parametros.costokm  = 0;
      }

      if( this.generalForm.value.servicios== null ||  this.generalForm.value.servicios== undefined)
      {
        this._snack.open("No ha capturado ningun producto o servicio", "", { duration: 2000, panelClass: ["snack-error"] });
        this.overlayRef.detach();
        return null;
      }
        this.ActionPost(parametros, "cotizaciones/nueva/save", 1);
        setTimeout(() => {
          this.overlayRef.detach();
        }, 3000); 
    }
  }

  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        switch (tipo) {
          //Clientes
          case 1: this.clientesList = data.DATA; this.searching = false; this.filteredClientes.next(this.clientesList); break;
          //Sucursales
          case 2:
            this.sucursalesList = data.DATA; this.searching = false; this.filteredSucursales.next(this.sucursalesList);
          break; //this.filtroSucursal(); break;
          //Servicios y Refacciones
          case 3: this.serviciosList = data.DATA;break; /*this.searching = false; this.filteredServicios.next(this.serviciosList);*/  //this.filtroServicios(); break;
          //Obtener sucursal del cliente seleccionado
          case 4:
            this.sucursalesList = data.DATA; //this.filtroServicios();
            this.generalForm.patchValue({sucursal_id: this.sucursalesList.length ? this.sucursalesList[0].id : 0});
            this.sucursalCtrl.setValue(this.sucursalesList[0]);
            this.filteredSucursales.next(this.sucursalesList);
            if(this.sucursalesList.length) {
              this.detalleSucursal(this.sucursalesList[0]);
              this.servicioSucursal(this.sucursalesList[0]);
            }
            break;
          case 5:
            this.datosPDF.detalleSucursal = data.DATA.length ? data.DATA[0] : {};
            break;
          case 6: // Obtener los costos por Cliente: km - alimentos - hospedaje - casetas
            if(data.DATA.length > 0 ) {
              this.objCostos.costoCasetas = parseFloat(data.DATA[0].casetas+"") ? parseFloat(data.DATA[0].casetas+"") : 0;
              this.objCostos.alimentos = parseFloat(data.DATA[0].alimentos+"") ? parseFloat(data.DATA[0].alimentos+"") : 0;
              this.objCostos.hospedaje = parseFloat(data.DATA[0].hospedaje+"") ? parseFloat(data.DATA[0].hospedaje+"") : 0;
              this.objCostos.km = parseFloat(data.DATA[0].km+"") ? parseFloat(data.DATA[0].km+"") : 0;
              this.generalForm.patchValue({ costokm: this.objCostos.km, viaticoAlimento: this.objCostos.alimentos, viaticoHospedaje: this.objCostos.hospedaje});
            } else {
              this.objCostos.costoCasetas = 0;
              this.objCostos.alimentos = 0;
              this.objCostos.hospedaje = 0;
              this.objCostos.km = 0;
              this.generalForm.patchValue({ costokm: this.objCostos.km, viaticoAlimento: this.objCostos.alimentos, viaticoHospedaje: this.objCostos.hospedaje});
            }
            break;
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

  selectSucursal = (seleccion: any) => {
    let params: any = { id: seleccion.value };
    let lstServicio: Servicio[] = [];
    this.generalForm.patchValue({servicios: lstServicio});
    this.ObtenerCombos('cotizaciones/obtener/sucursal', 4, params);
    this.ObtenerCombos('cotizaciones/obtener/costosCliente', 6, params);
  }

  detalleSucursal = (seleccion: any) => {
    let params: any = { id: seleccion.id };
    this.ObtenerCombos('cotizaciones/sucursal/detalle', 5, params);
    this.servicioSucursal(seleccion);
  }

  servicioSucursal = (seleccion: any) => {
    let params: any = { sucursal_id: seleccion.id };
    this.ObtenerCombos('mesaControl/servicios/combo', 3, params);
  }


  selReg: number = 0;
  selectRegistro = (registroSelect: any, tipo = 0 , combos = 0) => {
    this.selReg = registroSelect.id;
    let param = {opc: registroSelect.id};

    if(combos == 1)
    {
      switch(tipo)
      {
        
        case 1:
          let params: any = { buscar: event, opc: 0, id :0};
          let url = "";
          url = 'generales/sucursales/combo'; params.opc = registroSelect.id;
          this.ObtenerCombos(url, tipo = 2, params); 
        break;
      }
      
    }
    
    //this.ObtenerCombos('generales/sucursales/combo',2,param);
    /*
    filtrarPor = (tipo = 0, event) => {
    let params: any = { buscar: event, opc: 0, id :0};
    let url = "";
    switch (tipo) {
      case 1: url = 'generales/clientes/combo'; params.opc = 20; break;
      case 2: url = 'generales/sucursales/combo'; params.opc = 21; break;
    }
    this.ObtenerCombos(url, tipo, params);
    
    */

    switch(tipo) {
      case 1: this.datosPDF.razonSocial = registroSelect.nombre; break;
      case 2: this.datosPDF.tipoServicio = registroSelect.nombre; break;
    } 
    
  }

  formControlValueChanges = () => {
    this.generalForm.get("servicios").valueChanges.subscribe((reg) => {
      this.dataSourceServ.data = reg;
    });

    this.generalForm.get("traslados").valueChanges.subscribe((reg) => {
      this.dataSourceTras.data = reg;
    });

    this.generalForm.get("viaticos").valueChanges.subscribe((reg) => {
      this.dataSource.data = reg;
    })
  }

  deteleFrom = (reg, tipo: number = 0) => {
    let list: any[];
    let index: any;

    switch (tipo) {
      case 1:
        list = this.generalForm.get("servicios").value as Servicios[];
        index = list.findIndex(local => local.codigo == reg.codigo);
        list.splice(index, 1);
        this.generalForm.patchValue({ servicios: list });
        break;
      case 2:
        list = this.generalForm.get("traslados").value as Traslados[];
        index = list.findIndex(local => local.id == reg.id);
        list.splice(index, 1);
        this.generalForm.patchValue({ traslados: list });
        break;
      case 3:
        list = this.generalForm.get("viaticos").value as Viaticos[];
        index = list.findIndex(local => local.id == reg.id);
        list.splice(index, 1);
        this.generalForm.patchValue({ viaticos: list });
        break;
    }
  }

  previewPDF = () => {
    let fechalocal = new Date();
    this.datosPDF.fechalocal = ((fechalocal.getDate()+"").length == 1 ? "0"+fechalocal.getDate() : fechalocal.getDate()) + '/' + (((fechalocal.getMonth() + 1)+"").length == 1 ? "0"+(fechalocal.getMonth() + 1) : fechalocal.getMonth() + 1) + '/' + new Date().getFullYear();
    this.datosPDF.canal = "";
    this.datosPDF.tk = "";
    this.datosPDF.ot = "";
    this.datosPDF.folioInt = this.hoy;
    this.datosPDF.serviciosList = this.generalForm.value.servicios;
    this.datosPDF.trasladosList = this.generalForm.value.traslados;
    this.datosPDF.viaticosList = this.generalForm.value.viaticos;

    if(this.datosPDF.viaticosList != null)
    {
      this.datosPDF.viaticoAlimento = this.datosPDF.viaticosList[0].viaticoAlimento;
      this.datosPDF.viaticoHospedaje = this.datosPDF.viaticosList[0].viaticoHospedaje

    }
    else
    {
      this.datosPDF.viaticoAlimento = [];
      this.datosPDF.viaticoHospedaje = [];
    }
    if(this.datosPDF.trasladosList!=null)
    {
      this.objCostos.costokm = this.datosPDF.trasladosList[0].costokm ;
    }

    this.datosPDF.trasladoviaticos = [];
    this.datosPDF.totales = { ttldistancia: 0, ttlcostokm: 0, ttlcasetas: 0, ttlalimentos: 0, ttlhospedaje: 0, ttlpersonas: 0, ttldias: 0, ttlnoches: 0, total: 0 };
    /** Traslados - Viaticos */
    if(this.datosPDF.trasladosList!=null)
    {
      this.datosPDF.trasladosList.forEach(etraslado => {
        if(this.datosPDF.viaticosList != null)
        {
        this.datosPDF.viaticosList.forEach(eviatico => {
          if(etraslado.origen == eviatico.origen && etraslado.destino == eviatico.destino) {
            // Realizar calculos para obtener la cantidad
          // let calcosto = (this.objCostos.costokm * etraslado.casetas);
            let calcosto = (etraslado.costokm * (parseFloat(etraslado.distancia) ? parseFloat(etraslado.distancia) : 0));
            let calalimentos = (this.datosPDF.viaticoAlimento * eviatico.personas) * eviatico.dias;
            let calhopedaje = (this.datosPDF.viaticoHospedaje * eviatico.personas) * eviatico.noches;
          /* 
          let calalimentos = (etraslado.viaticoAlimento * eviatico.personas) * eviatico.dias;
          let calhopedaje = (etraslado.viaticoHospedaje * eviatico.personas) * eviatico.noches;  */
            // Obtener totales
            this.datosPDF.totales.ttldistancia += (parseFloat(etraslado.distancia) ? parseFloat(etraslado.distancia) : 0);
            this.datosPDF.totales.ttlcostokm += calcosto;
            this.datosPDF.totales.ttlcasetas += etraslado.casetas;
            this.datosPDF.totales.ttlalimentos += calalimentos;
            this.datosPDF.totales.ttlhospedaje += calhopedaje;
            this.datosPDF.totales.ttlpersonas += eviatico.personas;
            this.datosPDF.totales.ttldias += eviatico.dias;
            this.datosPDF.totales.ttlnoches += eviatico.noches;

            this.datosPDF.totales.total = (calcosto+calalimentos+calhopedaje);
            //+= calcosto + ((calalimentos*this.datosPDF.totales.ttlpersonas*eviatico.dias)+(calhopedaje*this.datosPDF.totales.ttlpersonas*eviatico.noches))
            // (((calalimentos + calhopedaje)* this.datosPDF.totales.ttlpersonas)*eviatico.dias);
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
              total:(calcosto+calalimentos+calhopedaje) 
              //calcosto +((calalimentos*eviatico.personas*eviatico.dias)+(calhopedaje*eviatico.personas*eviatico.noches))
            // total: calcosto + (((calalimentos + calhopedaje)* this.datosPDF.totales.ttlpersonas)*eviatico.dias)
              //calcosto + calalimentos + calhopedaje
              });
          }
        });}//Viaticos
      });//Traslados
  }
    pdfGeneral.pdfNvaCotizacion(this.datosPDF);
    ///let lstServicio: Servicio[] = [];
    //this.trasladosList = [];
    //this.viaticosList = [];
    //this.generalForm.patchValue({servicios: []});
    //this.generalForm.patchValue({traslados: this.trasladosList});
    //this.generalForm.patchValue({viaticos: this.viaticosList});
    //this.generalForm.reset();
  }

  ActionPost = (item: any, url: string, tipo: number = 0) => {
    item.folio = this.hoy;
    let size =  this.generalForm.value.servicios.length;
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        switch(tipo) {
          case 1:
            if(data["SUCCESS"]) {

              ////////////////////////////////////////////////////////////////////
              //        Guardar lista de Servicios, Traslados y Viaticos        //
              ////////////////////////////////////////////////////////////////////

              // banderas para saber si el registro enviado se guardó en base de datos
              let banServicos = 0;
              let banTraslados = 0;
              let banViaticos = 0;

              // contar los registros en la lista del formulario
              let contServicos = 0;
              let contTraslados = 0;
              let contViaticos = 0;

              let varmsg = "";

              this.datosPDF.folioInt = data["FOLIO"];
              this.generalForm.value.servicios.forEach(itemServicio => {

                /*********     Guardar Servicios     ****************/
                let detalleParams: any = {
                  id: itemServicio.id, 
                  cantidad: itemServicio.cantidad,
                  codigo: itemServicio.codigo, 
                  concepto: itemServicio.concepto, 
                  precio: itemServicio.precio,
                  cotizacion_id: data["ID"]
                };

                this._dataService.postData<any>('cotizaciones/nuevos/servicios', "", detalleParams).pipe(
                  finalize(() => {
                    contServicos++;
                    if (contServicos == size && (this.generalForm.value.traslados.length!=0
                      || this.generalForm.value.viaticos.length!=0))
                      {
                      /*********     Guardar Traslados     ****************/
                      this.generalForm.value.traslados.forEach(itemTraslado => {
                        let detalleParams: any = {
                          origen: itemTraslado.origen, destino: itemTraslado.destino,
                          distancia: itemTraslado.distancia, casetas: itemTraslado.casetas, cotizacion_id: data["ID"]
                        };
                        this._dataService.postData<any>('cotizaciones/nuevos/traslados', "", detalleParams).pipe(
                          finalize(() => {
                            contTraslados++;
                            if(contTraslados == this.generalForm.value.traslados.length){
                              /*********     Guardar Viáticos     ****************/

                              this.generalForm.value.viaticos.forEach(itemViatico => {

                                let detalleParams: any = {
                                  personas: itemViatico.personas, 
                                  dias: itemViatico.dias, 
                                  noches: itemViatico.noches ,
                                  origen: itemViatico.origen, 
                                  destino: itemViatico.destino, 
                                  cotizacion_id: data["ID"]
                                };
                                this._dataService.postData<any>('cotizaciones/nuevos/viaticos', "", detalleParams).pipe(
                                  finalize(() => {
                                    contViaticos++;
                                    if (contViaticos == this.generalForm.value.viaticos.length) {

                                      if (banServicos == this.generalForm.value.servicios.length && banTraslados == this.generalForm.value.traslados.length && banViaticos == this.generalForm.value.viaticos.length) {
                                        varmsg = data["MESSAGE"];
                                      }
                                      if (banServicos == this.generalForm.value.servicios.length && banTraslados == this.generalForm.value.traslados.length && banViaticos != this.generalForm.value.viaticos.length) {
                                        varmsg = "Se generó la Cotización pero algunos Viáticos no se guardaron correctamente";
                                      }
                                      if (banServicos == this.generalForm.value.servicios.length && banTraslados != this.generalForm.value.traslados.length && banViaticos == this.generalForm.value.viaticos.length) {
                                        varmsg = "Se generó la Cotización pero algunos Traslados no se guardaron correctamente";
                                      }
                                      if (banServicos != this.generalForm.value.servicios.length && banTraslados == this.generalForm.value.traslados.length && banViaticos == this.generalForm.value.viaticos.length) {
                                        varmsg = "Se generó la Cotización pero algunos Servicios no se guardaron correctamente";
                                      }
                                      if (banServicos != this.generalForm.value.servicios.length && banTraslados != this.generalForm.value.traslados.length && banViaticos == this.generalForm.value.viaticos.length) {
                                        varmsg = "Se generó la Cotización pero algunos Servicios y Traslados no se guardaron correctamente";
                                      }
                                      if (banServicos != this.generalForm.value.servicios.length && banTraslados == this.generalForm.value.traslados.length && banViaticos != this.generalForm.value.viaticos.length) {
                                        varmsg = "Se generó la Cotización pero algunos Servicios y Viáticos no se guardaron correctamente";
                                      }
                                      if (banServicos == this.generalForm.value.servicios.length && banTraslados != this.generalForm.value.traslados.length && banViaticos != this.generalForm.value.viaticos.length) {
                                        varmsg = "Se generó la Cotización pero algunos Traslados y Viáticos no se guardaron correctamente";
                                      }
                                      if (banServicos != this.generalForm.value.servicios.length && banTraslados != this.generalForm.value.traslados.length && banViaticos != this.generalForm.value.viaticos.length) {
                                        varmsg = "Se generó la Cotización pero algunos Servicios, Traslados y Viáticos no se guardaron correctamente";
                                      }

                                      if(!this.datosPDF.hasOwnProperty("detalleSucursal")) {
                                        varmsg += ". No se puede generar el PDF";
                                        this._snack.open(varmsg, "", { duration: 8000, panelClass: ["snack-ok"] });
                                        return false;
                                      } else {
                                        this._snack.open(varmsg, "", { duration: 8000, panelClass: ["snack-ok"] });
                                      }

                                      let fechalocal = new Date();
                                      this.datosPDF.fechalocal = ((fechalocal.getDate()+"").length == 1 ? "0"+fechalocal.getDate() : fechalocal.getDate()) + '/' + (((fechalocal.getMonth() + 1)+"").length == 1 ? "0"+(fechalocal.getMonth() + 1) : fechalocal.getMonth() + 1) + '/' + new Date().getFullYear();
                                      this.datosPDF.canal = "";
                                      /*
                                      this.datosPDF.viaticoAlimento = this.objCostos.alimentos;
                                      this.datosPDF.viaticoHospedaje = this.objCostos.hospedaje;
                                      this.datosPDF.costokm = this.objCostos.km;
                                      */

                                      this.datosPDF.trasladoviaticos = [];
                                      this.datosPDF.totales = { ttldistancia: 0, ttlcostokm: 0, ttlcasetas: 0, ttlalimentos: 0, ttlhospedaje: 0, ttlpersonas: 0, ttldias: 0, ttlnoches: 0, total: 0 };
                                      let calalimentos : any  = 0;
                                      let calhopedaje: any = 0 ;
                                      /** Traslados - Viaticos */
                                      this.datosPDF.trasladosList.forEach(etraslado => {
                                        this.datosPDF.viaticosList.forEach(eviatico => {
                                          if(etraslado.origen == eviatico.origen && etraslado.destino == eviatico.destino) {
                                            // Realizar calculos para obtener la cantidad
                                           
                                            let calcosto = pdfGeneral.formatearCarntidad2Dig(etraslado.costokm * (parseFloat(etraslado.distancia) ? parseFloat(etraslado.distancia) : 0));//pdfGeneral.formatearCarntidad2Dig(this.datosPDF.costokm * etraslado.casetas);
                                            if(eviatico.viaticoAlimento != 0 || eviatico.dias != 0)
                                            {
                                              calalimentos = pdfGeneral.formatearCarntidad2Dig((eviatico.viaticoAlimento * eviatico.personas) * eviatico.dias);
                                            }
                                            if(eviatico.viaticoHospedaje!= 0 || eviatico.noches !=0)
                                            {
                                              calhopedaje = pdfGeneral.formatearCarntidad2Dig((eviatico.viaticoHospedaje * eviatico.personas) * eviatico.noches);
                                            }

                                            //let calalimentos = pdfGeneral.formatearCarntidad2Dig((eviatico.viaticoAlimento * eviatico.personas) * eviatico.dias); //pdfGeneral.formatearCarntidad2Dig((this.datosPDF.viaticoAlimento * eviatico.personas) * eviatico.dias);
                                            //let calhopedaje = pdfGeneral.formatearCarntidad2Dig((eviatico.viaticoHospedaje * eviatico.personas) * eviatico.noches);//pdfGeneral.formatearCarntidad2Dig((this.datosPDF.viaticoHospedaje * eviatico.personas) * eviatico.noches);
                                            
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
                                     // localStorage.removeItem('viajes');
                                     
                                      let lstServicio: Servicio[] = [];
                                      this.trasladosList = [];
                                      this.viaticosList = [];
                                      
                                      this.generalForm.patchValue({servicios: lstServicio});
                                      this.generalForm.patchValue({traslados: this.trasladosList});
                                      this.generalForm.patchValue({viaticos: this.viaticosList});
                                      this.generalForm.reset();
                                      this.dataSourceServ = new MatTableDataSource<Servicios>();
                                      this.hoy = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");
                                      pdfGeneral.pdfNvaCotizacion(this.datosPDF);
                                    }
                                  })
                                ).subscribe(dataV => { 
                                  
                                  if(dataV["SUCCESS"]) { banViaticos = banViaticos + 1; this.datosPDF.viaticosList.push(itemViatico); }
                                
                                }, 
                                  errorV => { banViaticos = banViaticos; });
                              });
                              /***************************************************/
                            }
                          })
                        ).subscribe(
                          dataT => { 
                            if(dataT["SUCCESS"]) { banTraslados = banTraslados + 1; this.datosPDF.trasladosList.push(itemTraslado); } }, 
                            errorT => { banTraslados = banTraslados; });
                      });
                      /***************************************************/
                    }
                    if(contServicos == size)
                    {
                      
                     this._snack.open("Información almacenda con éxito", "", { duration: 2000, panelClass: "snack-ok" });
                     this.dataSourceServ = new MatTableDataSource<Servicios>();
                     this.clientesList = [];
                     this.filteredClientes.next(this.clientesList);
                     this.sucursalesList = [];
                     this.filteredSucursales.next(this.sucursalesList)
                     this.serviciosList = [];
                     localStorage.removeItem('viajes');
                     this.hoy = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");

                     
                    }
                  }
                  )
                ).subscribe(
                  dataS => { 
                    if(dataS["SUCCESS"]) {
                     banServicos = banServicos + 1; 
                     this.datosPDF.serviciosList.push(itemServicio);
                   
                    } 
                    }, 
                    errorS => {  console.log("Error Guardado de servicios.");banServicos = banServicos; });
                /***************************************************/
              }
              );
             
            } else {
              this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
            }
            
            break;
          case 2: console.log("resp2: ", data); break;
        }

      }, error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
   
  }

}

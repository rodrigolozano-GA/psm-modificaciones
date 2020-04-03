import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ReplaySubject, Subject, of, Observable, observable } from 'rxjs';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { filter, tap, takeUntil, debounceTime, map, delay, finalize } from 'rxjs/operators';
import { MatTableDataSource, MatDialog, MatSnackBar, MatSelect } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoSeleccionServiciosComponent } from '../dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';
import { formatDate } from '@angular/common';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { DialogoServiciosComponent } from '../dialogo-servicios/dialogo-servicios.component';
import { DialogoSucursalComponent } from '../dialogo-sucursal/dialogo-sucursal.component';
import { Folio } from 'src/app/clases/MesaControl/Folio';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';


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
  nombre: string;
}

export interface Servicios {
  id: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  costo: number;
}

export interface Coordinador {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-nuevo-folio',
  templateUrl: './nuevo-folio.component.html',
  styleUrls: ['./nuevo-folio.component.scss']
})
export class NuevoFolioComponent implements OnInit {

  folio: Folio = new Folio();
  clientesList = []

  sucursalesList = []

  sucursalFolioList = []

  serviciosList = []

  coordinadoresList = []

  mediosList = []

  equiposList = [
    { id: 1, nombre: "Nombre equipo 1" },
    { id: 2, nombre: "Nombre equipo 2" },
    { id: 3, nombre: "Nombre equipo 3" },
    { id: 4, nombre: "Nombre equipo 4" },
    { id: 5, nombre: "Nombre equipo 5" },
    { id: 6, nombre: "Nombre equipo 6" },
    { id: 7, nombre: "Nombre equipo 7" }
  ]

  SERV_DATA: Servicios[] = [
    { id: 1, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, costo: 3250 },
    { id: 2, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 3, costo: 3250 },
    { id: 3, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 4, costo: 3250 },
    { id: 4, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, costo: 3250 },
    { id: 5, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 2, costo: 3250 },
    { id: 6, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 3, costo: 3250 },
    { id: 7, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, costo: 3250 },
    { id: 8, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, costo: 3250 },
    { id: 9, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, costo: 3250 },
    { id: 10, codigo: "MOCAJ01", nombre: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", cantidad: 1, costo: 3250 }
  ];

   /** control for the MatSelect filter keyword */
   public clientFilterCtrl: FormControl = new FormControl();

   /** list of banks filtered by search keyword */
   public filteredBanks: ReplaySubject<Cliente[]> = new ReplaySubject<Cliente[]>(1);
 
   @ViewChild('singleSelect', { static: true }) singleSelect: MatSelect;

  /** control for the selected bank for server side filtering */
  public clienteCtrl: FormControl = new FormControl();
  public sucursalCtrl: FormControl = new FormControl();
  public servicioCtrl: FormControl = new FormControl();
  public coordinadorCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public clienteFilteringCtrl: FormControl = new FormControl();
  public sucursalFilteringCtrl: FormControl = new FormControl();
  public servicioFilteringCtrl: FormControl = new FormControl();
  public coordinadorFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searching: boolean = false;

  /** list of banks filtered after simulating server side search */
  public filteredClientes: ReplaySubject<Cliente[]> = new ReplaySubject<Cliente[]>(1);
  public filteredSucursales: ReplaySubject<Sucursal[]> = new ReplaySubject<Sucursal[]>(1);
  public filteredServicios: ReplaySubject<Servicio[]> = new ReplaySubject<Servicio[]>(1);
  public filteredCoordinadores: ReplaySubject<Coordinador[]> = new ReplaySubject<Coordinador[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();


  displayedColumnsServ: string[] = ['codigo', 'concepto', 'cantidad', 'precio', 'importe', 'actions'];
  dataSourceServ = new MatTableDataSource<Servicio>();
  selectionServ = new SelectionModel<Servicios>(true, [])

  overlayRef: OverlayRef;

  //Formulario
  generalForm: FormGroup;
  generalUrl: string = "";
  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  constructor(private _dialog: MatDialog,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _fB: FormBuilder,
    private _overlay: Overlay) {
     }

  fileName: string = "";
  fileData: FormData = new FormData();
  todaysDate = formatDate(Date.now(), "dd/MM/yyyy", "en-US");
  hoy: string;
  today = new Date();
  minDate = new Date(this.today.getFullYear(), this.today.getMonth(),this.today.getDate());
  
  ngOnInit() {
    this.hoy = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");
    this.generalForm = this._fB.group({
      id: [this.folio.id],
      numero: [this.folio.numero],
      folio: [{ value: this.folio.folio, disabled: true }],
      archivo: [''],
      fecha_programada: [this.folio.fecha_programada, [Validators.required]],
      fecha_programada_folio: [""],
      medio_id: [this.folio.medio_id, [Validators.required]],
      medio: [this.folio.medio],
      cliente_id: [this.folio.cliente_id,[Validators.required]],
      cliente: [this.folio.cliente],
      sucursal_id: [this.folio.sucursal_id,[Validators.required]],
      sucursal: [this.folio.sucursal],
      tipoequipo_id: [this.folio.tipoequipo_id],
      tipoequipo: [this.folio.tipoequipo],
      tiposervicio_id: [this.folio.tiposervicio_id,[Validators.required]],
      tiposervicio: [this.folio.tiposervicio],
      coordinador_id: [this.folio.coodinador_id,[Validators.required]],
      coordinador:[this.folio.coodinador],
      ot: [this.folio.ot],
      ticket: [this.folio.ticket],
      servicios: [this.folio.servicios],
      descripcion: [this.folio.descripcion,[Validators.required]],
      observaciones: [this.folio.observaciones,[Validators.required]],
      zona: [""],
      zona_id: [1],
      estatus: [""],
      estatus_id: [0]
    })

    this.formControlValueChanges();

    this.filtroCliente();
    this.filtroSucursal();
    this.filtroServicios();
    this.filtroCoordinador();

    let params: any = { opc: 10 };
    this.ObtenerCombos('catalogos/medios/combo', 5, params);
    this.ObtenerCombos('catalogos/equipos/combo', 6, params);
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

  dialogoAgregarProductos = () => {

    if(!this.generalForm.value.cliente_id) {
      return this._snack.open("Seleccione un cliente", "", { duration: 2000, panelClass: ["snack-error"] });
    }
                                      //DialogoSeleccionServiciosComponent
    const dialogRef = this._dialog.open(DialogoSeleccionServiciosComponent, {
      panelClass: "dialog-servicios",
      data: { data: this.generalForm.value }
    })

    dialogRef.beforeClosed().subscribe((res) => {
      if (res.length) {
        let list: any[];
        list = this.generalForm.value.servicios;

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
    this.dataSourceServ.data.map(reg => {
      if (reg.id == id) {
        valido = true;
      }
    })
    return valido;
  }

  dialogoServicios = () => {
    const dialogRef = this._dialog.open(DialogoServiciosComponent, {
      panelClass: "dialog-servicios"
    })

    dialogRef.beforeClosed().subscribe((res) => {
      console.log(res);
    })
  }

  filtroCliente = () => {
    this.clienteFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
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

  filtroSucursal = () => {
    this.sucursalFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
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

  filtroCoordinador = () => {
    this.coordinadorFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.coordinadoresList) {
            return [];
          }

          // simulate server fetching and filtering data
          return this.coordinadoresList.filter(coordinador => coordinador.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredCoordinadores => {
        this.searching = false;
        this.filteredCoordinadores.next(filteredCoordinadores);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });

  }
/*
  fileToUpload : File = null;
  fileChange(files: FileList) {
    this.fileToUpload = files.item(0);
  } */
  fileToUpload : File = null;
  ext : string;
  fileChange = (file: any): void => {
    //console.log('file:' , file,' name: ',file.target.files[0].name);
    if(file.target.files.length > 0){
      this.fileName = file.target.files[0].name;
      this.fileToUpload = file.target.files[0];
      this.ext = this.fileName.substring(this.fileName.indexOf('.'),this.fileName.length).toString();
     // this.fileData.append('archivoFolio', file.data, this.fileName); 
    }
  }
  

  filtrarPor = (tipo = 0, event) => {
    let params: any = { buscar: event, opc: 0 };
    let url = "";
    switch (tipo) {
      case 1: url = 'generales/clientes/combo'; params.opc = 20; break;
      case 2: url = 'generales/sucursales/combo'; params.opc = 21; break;
      case 3: url = 'catalogos/tiposServicios/combo';break;
      case 4: url = 'catalogos/coordinadores/combo'; params.opc = 13; break;
    }
    this.ObtenerCombos(url, tipo, params);
  }

  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    let seleccionar = {  };
    this.sucursalesList = [];
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {

        switch (tipo) {
          //Clientes
          case 1: this.clientesList = data.DATA; this.searching = false; this.filteredClientes.next(this.clientesList);break;
          //Sucursales
          case 2: this.sucursalesList = data.DATA; this.searching = false; this.filteredSucursales.next(this.sucursalesList); break;
          //Tipos de Servicio
          case 3: this.serviciosList = data.DATA; this.searching = false; this.filteredServicios.next(this.serviciosList); break;
          //Coordinador
          case 4: this.coordinadoresList = data.DATA; this.searching = false; this.filteredCoordinadores.next(this.coordinadoresList); break;
          //Medios
          case 5: this.mediosList = data.DATA; break;
          //Equipos
          case 6: this.equiposList = data.DATA; break;
          //Sucursales por Cliente
          case 7:
              this.sucursalesList = data.DATA; //this.filtroSucursal();
              if(this.sucursalesList.length == 0)
              {
                this.filteredSucursales.next([]);
                this.filteredCoordinadores.next([]);
                this.filteredServicios.next([]);
              }
              //obtener los Tipos de Servicios
              this.generalForm.patchValue({sucursal: ""});
              if(this.sucursalesList.length){
                this.generalForm.patchValue({sucursal_id: this.sucursalesList.length ? this.sucursalesList[0].id : 0});
                this.generalForm.patchValue({sucursal: this.sucursalesList[0].nombre});
                this.sucursalCtrl.setValue(this.sucursalesList[0]);
                this.filteredSucursales.next(this.sucursalesList);

                seleccionar = { value: this.sucursalesList[0].id };
                this.obtenerFoliosSucursal();
                this.selectRegistro(seleccionar, 2);
              }
          break;
          //Coordinador por Tipo de servicio
          case 8:
              this.coordinadoresList = data.DATA; //this.filtroCoordinador();
              if(this.coordinadoresList.length == 0)
              {
                this.filteredCoordinadores.next([]);
              }
              this.generalForm.patchValue({coordinador_id: this.coordinadoresList.length ? this.coordinadoresList[0].id : 0});
              this.generalForm.patchValue({coordinador: this.coordinadoresList.length ? this.coordinadoresList[0].nombre : ""});
              this.generalForm.patchValue({zona: data.DATA.length ? data.DATA[0].zona : ""});
              this.coordinadorCtrl.setValue(this.coordinadoresList[0]);
              this.filteredCoordinadores.next(this.coordinadoresList);
          break;
          //Tipo de Servicio por Sucursarl
          case 9:
              this.serviciosList = data.DATA; //this.filtroServicios();
              if(this.serviciosList.length == 0)
              {
                this.filteredServicios.next([]);
              }    
              //obtener coordinador
              this.generalForm.patchValue({servicio: ""});
              if(this.serviciosList.length) {
                this.generalForm.patchValue({tiposervicio_id: this.serviciosList.length ? this.serviciosList[0].id : 0});
                this.generalForm.patchValue({tiposervicio: this.serviciosList[0].nombre});
                this.servicioCtrl.setValue(this.serviciosList[0]);
                this.filteredServicios.next(this.serviciosList);

                seleccionar = { value: this.serviciosList[0].id };
                this.selectRegistro(seleccionar, 3);
              }
          break;
          //Obtener los folios de una Sucursal seleccionada
          case 10: this.sucursalFolioList = data.DATA; break;
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

  selectRegistro = (seleccion: any, tipo = 0) => {
    if(!seleccion.hasOwnProperty("value")){
       seleccion.value = seleccion.id; 
      }

    let params: any = { id: typeof(seleccion.value) == "number" ? seleccion.value : seleccion.value.id, sucursal_id: 0 };
    let config = { url: "", opc: 0 };
    
    switch(tipo) {
      case 1: let servicios: Servicio[] = []; this.generalForm.patchValue({servicios: servicios}); config.url = 'cotizaciones/obtener/sucursal'; config.opc = 7; break;
      case 2: config.url = 'mesaControl/servicios/combo'; config.opc = 9; params.sucursal_id = params.id; this.obtenerFoliosSucursal(); break;
      case 3: config.url = 'mesaControl/coordinador/combo'; config.opc = 8; params.sucursal_id = this.generalForm.value.sucursal_id; break;
    }
    this.ObtenerCombos(config.url, config.opc, params);
  }

  selectActualizaForm = (seleccion: any, tipo = 0) => {
    switch(tipo) {
      case 1: this.generalForm.patchValue({cliente: seleccion.nombre}); break;
      case 2: this.generalForm.patchValue({medio: seleccion.nombre}); break;
      case 3: this.generalForm.patchValue({tipoequipo: seleccion.nombre}); break;
      case 4: this.generalForm.patchValue({tiposervicio: seleccion.nombre}); break;
      case 5:
        this.coordinadoresList.forEach(item => {
          if(item.id == seleccion.id) {
            this.generalForm.patchValue({zona: seleccion.zona});
            this.generalForm.patchValue({coordinador: seleccion.nombre});
            this.generalForm.patchValue({zona_id: 1});
          }
        });
        break;
    }
  }

  obtenerFoliosSucursal = () => {
    let params: any = { sucursal_id: this.generalForm.value.sucursal_id };
    this.ObtenerCombos('mesaControl/sucursal/obtFolios', 10, params);
  }

  dialogoSucursal = () => {
    const _dialogRef = this._dialog.open(DialogoServiciosComponent, {
      panelClass: 'dialog-sucursal',
      data: { data: this.sucursalFolioList }
    })

    /*_dialogRef.afterClosed().subscribe(res => {

    })*/
  }

  deteleFrom = (reg) => {
    let list: any[];
    let index: any;

    list = this.generalForm.get("servicios").value as Servicios[];
    index = list.findIndex(local => local.codigo == reg.codigo);
    list.splice(index, 1);
    this.generalForm.patchValue({ servicios: list });
  }

  Guardar = () => {
    this.generalForm.patchValue({fecha_programada_folio: formatDate(this.generalForm.value.fecha_programada, "yyyy/MM/dd", "en-US")});

    if(!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      this._snack.open("Faltan campos obligatorios", "", { duration: 2000, panelClass: ["snack-error"] });
      return false;
    }
    if((this.ext != ".pdf" && this.ext != ".xls" && this.ext != ".xlsx" && this.ext!="doc" && this.ext!=".docx")) 
    {
      this._snack.open("Tipo de archivo no soportado.", "", { duration: 2000, panelClass: ["snack-error"] });
      return false;
    }
    const uploadData = new FormData();
    if(this.generalForm.value.ticket == null || this.generalForm.value.ticket== undefined)
    {
      this.generalForm.patchValue({ticket: 0});
    }
    if(this.generalForm.value.ot == null || this.generalForm.value.ot== undefined)
    {
      this.generalForm.patchValue({ot:0});
    }
    if(this.generalForm.value.servicios == null) {
      this.generalForm.patchValue({servicios: []});
    }
    
    uploadData.append('archivoFolio',this.fileToUpload,this.fileName);
    uploadData.append('sucursal_id', this.generalForm.value.sucursal_id);
    uploadData.append('tiposervicio_id', this.generalForm.value.tiposervicio_id);
    uploadData.append('descripcion', this.generalForm.value.descripcion);
    uploadData.append('observaciones', this.generalForm.value.observaciones);
    uploadData.append('coordinador_id', this.generalForm.value.coordinador_id);
    uploadData.append('fecha_programada_folio', this.generalForm.value.fecha_programada_folio);
    uploadData.append('medio_id', this.generalForm.value.medio_id);
    uploadData.append('ot', this.generalForm.value.ot);
    uploadData.append('ticket', this.generalForm.value.ticket);
    uploadData.append('folio', this.hoy);
    this.mostrarCarga();
    this.ActionPost(uploadData, 'mesaControl/nuevo/save');
    
    if(this.generalForm.value.servicios == undefined) {
      this.generalForm.patchValue({servicios: []});
    }
 
  }

  formControlValueChanges = () => {
    this.generalForm.get("servicios").valueChanges.subscribe((reg) => {
      this.dataSourceServ.data = reg;
    });
  }

  previsualizar = () => {

    if((formatDate(this.generalForm.get("fecha_programada").value, "dd/MM/yyyy", "en-US")<this.todaysDate))
    {
      this._snack.open("No se permite agendar un servicio anterior a la fecha actual", "", { duration: 2000, panelClass: ["snack-error"] }); 
      return null;
    }
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-folio',
      data: { accion: 3, data: this.generalForm.value, folio: this.hoy }
    })

  }

  ActionPost = (item: FormData, url: string, tipo: number = 0) => {

    this._dataService.postFile<any>(url,item).subscribe(
      data => {
        if(data["SUCCESS"]) {

          ////////////////////////////////////////////////////////////////////
          //                  Guardar lista de Servicios                    //
          ////////////////////////////////////////////////////////////////////

          // banderas para saber si el registro enviado se guardó en base de datos
          let banServicos = 0;

          // contar los registros en la lista del formulario
          let contServicos = 0;

          let varmsg = "";
          if( this.generalForm.value.servicios.length!=0)
          {
            this.generalForm.value.servicios.forEach(itemServicio => {
              /*********     Guardar Servicios     ****************/
              let detalleParams: any = {id: itemServicio.id, cantidad: itemServicio.cantidad,
                codigo: itemServicio.codigo, concepto: itemServicio.concepto, precio: itemServicio.precio,
                folio_id: data["ID"]};
              this._dataService.postData<any>('mesaControl/servicios/save', "", detalleParams).pipe(
                finalize(() => {
                  this.overlayRef.detach();
                  contServicos++;
                  if (contServicos == this.generalForm.value.servicios.length) {
                    if (banServicos == this.generalForm.value.servicios.length) {
                      varmsg = data["MESSAGE"];
                    }
                    if (banServicos != this.generalForm.value.servicios.length) {
                      varmsg = "Se generó el Folio pero algunos Servicios no se guardaron correctamente";
                    }
                    this._snack.open(varmsg, "", { duration: 10000, panelClass: ["snack-ok"] });
                    let lstServicio: Servicio[] = [];
                    this.generalForm.patchValue({servicios: lstServicio});
                    this.sucursalFolioList = [];
                    this.generalForm.reset();
                    this.fileName = '';
                    this.hoy = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");
                  }
                })
              ).subscribe(
                data => { 
                  if(data["SUCCESS"]) { 
                    banServicos = banServicos + 1; 
                  } }, 
                errorS => { 
                  banServicos = banServicos; 
                  this.overlayRef.detach(); });
              /***************************************************/
            });
        }
        this._snack.open("Datos guardados correctamente", "", { duration: 10000, panelClass: ["snack-ok"] });
        let lstServicio: Servicio[] = [];
        this.generalForm.patchValue({servicios: lstServicio});
        this.sucursalFolioList = [];
        this.generalForm.reset();
        this.fileName = '';
        this.hoy = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");
        this.overlayRef.detach();
         
        } else {
          this._snack.open(data["error_msg"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] }); this.overlayRef.detach();
        }
      } , error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    ); 
  }
 
}

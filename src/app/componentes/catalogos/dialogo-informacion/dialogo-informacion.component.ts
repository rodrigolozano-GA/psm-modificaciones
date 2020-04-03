import { Component, OnInit, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Estatus } from '../../../clases/Catalogos/Estatus';
import { Gasto, ConceptoGasto } from '../../../clases/Catalogos/Gasto';
import { Zona, ZonaLst } from '../../../clases/Catalogos/Zona';
import { TipoDocumento } from '../../../clases/Catalogos/TipoDocumento';
import { TipoServicio } from '../../../clases/Catalogos/TipoServicio';
import { TipoEstatus } from '../../../clases/Catalogos/TipoEstatus';
import { MotivoEstatus } from '../../../clases/Catalogos/MotivoEstatus';
import { Coordinador, CoordinadorLst } from 'src/app/clases/Catalogos/Coordinador';
import { Tecnico, TecnicoLst } from 'src/app/clases/Catalogos/Tecnico';
import { Empleado } from 'src/app/clases/Catalogos/Empleado';
import { Equipo, Caracteristica } from 'src/app/clases/Catalogos/Equipo';
import { Medio } from 'src/app/clases/Catalogos/Medio';
import { Tecnico as TecnicoO } from '../../../clases/Operaciones/Tecnico';
import { Caracteristica as EquipoCaracteristica } from '../../../clases/Catalogos/Caracteristica';

import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatSelect, MatTableDataSource, MatSort, MatPaginator, MatSelectionList } from '@angular/material';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { FormControl, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, delay, startWith, take, finalize } from 'rxjs/operators';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { FormatoActa } from 'src/app/clases/Catalogos/FormatoActa';

export interface EstadosList {
  id: number;
  nombre: string;
  estatus: number;
}

@Component({
  selector: 'app-dialogo-informacion',
  templateUrl: './dialogo-informacion.component.html',
  styleUrls: ['./dialogo-informacion.component.scss']
})
export class DialogoInformacionComponent implements OnInit, AfterViewInit {

  //Declaraciones
  estatus: Estatus = new Estatus();
  gasto: Gasto = new Gasto();
  concepto: ConceptoGasto = new ConceptoGasto();
  zona: Zona = new Zona();
  tipoDocumento: TipoDocumento = new TipoDocumento();
  tipoServicio: TipoServicio = new TipoServicio();
  tipoEstatus: TipoEstatus = new TipoEstatus();
  motivoEstatus: MotivoEstatus = new MotivoEstatus();
  coordinador: Coordinador = new Coordinador();
  tecnico: Tecnico = new Tecnico();
  equipo: Equipo = new Equipo();
  medio: Medio = new Medio();
  formatoActa: FormatoActa = new FormatoActa();

  titulo: string = "";
  pCatalogo: string = '';

  //Listas
  listaTipos = []
  listaEstatus = []
  listaTipoEstatus = [];
  listaCoordinadores = [
    { id: 1, nombre: "Coordinador 1" },
    { id: 2, nombre: "Coordinador 2" },
    { id: 3, nombre: "Coordinador 3" },
    { id: 4, nombre: "Coordinador 4" },
    { id: 5, nombre: "Coordinador 5" },
    { id: 6, nombre: "Coordinador 6" }
  ];
  listaCatalogos = [
    { id: 'cat_cotizaciones', nombre: "Cotizaciones" },
    { id: 'cat_cotizaciones', nombre: "Cotizaciones" },
    { id: 'cat_cotizaciones', nombre: "Cotizaciones" },
    { id: 'cat_cotizaciones', nombre: "Cotizaciones" },
    { id: 'cat_cotizaciones', nombre: "Cotizaciones" },
    { id: 'cat_cotizaciones', nombre: "Cotizaciones" }
  ];
  // llenar lista desde db
  listEstados = [];
  tipoServiciosList = [
    { id: 1, nombre: "Nombre del tipo de estatus" },
    { id: 1, nombre: "Nombre del tipo de estatus" },
    { id: 1, nombre: "Nombre del tipo de estatus" },
    { id: 1, nombre: "Nombre del tipo de estatus" },
    { id: 1, nombre: "Nombre del tipo de estatus" },
    { id: 1, nombre: "Nombre del tipo de estatus" },
    { id: 1, nombre: "Nombre del tipo de estatus" }
  ]
  empleadosList: Empleado[] = [];
  zonasList: ZonaLst[] = [];
  tecnicosList: TecnicoLst[] = [];
  tecnicosOList: any[] = [];
  serviciosList: TipoServicio[] = [];
  coordinadoresList: CoordinadorLst[] = [];
  caracteristicasList: EquipoCaracteristica[] = [];
  deduciblesList = [
    { id: 1, nombre: "No" },
    { id: 2, nombre: "Sí" }
  ]
  gastosList: Gasto[] = [];
  tecnicosData: TecnicoO[] = []
  inventarioList: TecnicoLst[] = [
    { id: 1, nombre: "Nombre de herramienta/refaxion" },
    { id: 2, nombre: "Nombre de herramienta/refaxion" },
    { id: 3, nombre: "Nombre de herramienta/refaxion" },
    { id: 4, nombre: "Nombre de herramienta/refaxion" },
    { id: 5, nombre: "Nombre de herramienta/refaxion" },
    { id: 6, nombre: "Nombre de herramienta/refaxion" },
    { id: 7, nombre: "Nombre de herramienta/refaxion" },
    { id: 8, nombre: "Nombre de herramienta/refaxion" },
  ]
  filteredCaracteristicas: any[] = [];
  //Formulario
  generalForm: FormGroup;
  generalUrl: string = "";
  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  // Loader
  overlayRef: OverlayRef;

  //----------------------------------------

  /** control for the selected bank for server side filtering */
  // public empleadoCtrl: FormControl = new FormControl();
  public zonaCtrl: FormControl = new FormControl();
  public tecnicoCtrl: FormControl = new FormControl();
  public servicioCtrl: FormControl = new FormControl();
  public coordinadorCtrl: FormControl = new FormControl();

  /** control for filter for server side. */
  public empleadoFilteringCtrl: FormControl = new FormControl();
  public zonaFilteringCtrl: FormControl = new FormControl();
  public tecnicoFilteringCtrl: FormControl = new FormControl();
  public servicioFilteringCtrl: FormControl = new FormControl();
  public coordinadorFilteringCtrl: FormControl = new FormControl();
  public gastosFilteringCtrl: FormControl = new FormControl();
  public tecnicosOFilteringCtrl: FormControl = new FormControl();

  /** indicate search operation is in progress */
  public searching: boolean = false;

  /** list of banks filtered after simulating server side search */
  public filteredEmpleados: ReplaySubject<Empleado[]> = new ReplaySubject<Empleado[]>(1);
  public filteredZonas: ReplaySubject<ZonaLst[]> = new ReplaySubject<ZonaLst[]>(1);
  public filteredTecnicos: ReplaySubject<TecnicoLst[]> = new ReplaySubject<TecnicoLst[]>(1);
  public filteredServicios: ReplaySubject<TipoServicio[]> = new ReplaySubject<TipoServicio[]>(1);
  public filteredCoordinadores: ReplaySubject<CoordinadorLst[]> = new ReplaySubject<CoordinadorLst[]>(1);
  public filteredGastos: ReplaySubject<Gasto[]> = new ReplaySubject<Gasto[]>(1);
  public filteredTecnicosOList: ReplaySubject<TecnicoO[]> = new ReplaySubject<TecnicoO[]>(1);

  /** Subject that emits when the component has been destroyed. */
  protected _onDestroy = new Subject<void>();

  @ViewChild('empleadoSelect', { static: true }) empleadoSelect: MatSelect;

  tecnColumns: string[] = ['numero', 'nombre', 'actions'];
  dataTecnicos = new MatTableDataSource(this.tecnicosData);
  @ViewChild('tableTecn', { static: false }) sortTecs: MatSort;
  @ViewChild('tecPaginator', { static: false }) paginatorTecs: MatPaginator;


  caracteristicasColumns: string[] = ['nombre', 'actions'];
  dataCaracteristica = new MatTableDataSource(this.caracteristicasList);
  @ViewChild('CaracPaginator', { static: false }) paginatorCarac: MatPaginator;

  constructor(
    public _dialogRef: MatDialogRef<DialogoInformacionComponent>,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _fB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _overlay: Overlay,
    private _formRef: ChangeDetectorRef) {
    this.pCatalogo = this.data.catalogo;
    this.titulo = this.data.titulo;
  }

  ngOnInit() {

    switch (this.pCatalogo) {
      case 'E': this.dialogoEstatus(); break;
      case 'D': this.dialogoTipoDocumentos(); break;
      case 'S': this.dialogoTipoServicios(); break;
      case 'G': this.dialogoGastos(); break;
      case 'TE': this.dialogoTipoEstatus(); break;
      case 'ME': this.dialogoMotivoEstatus(); break;
      case 'C': this.dialogoCoordinadores(); break;
      case 'TC': this.dialogoTecnicos(); break;
      case 'Z': this.dialogoZonas(); break;
      case 'CG': this.dialogoConceptos(); break;
      case 'EQ': this.dialogoEquipos(); break;
      case 'MD': this.dialogoMedios(); break;
      case 'FA': this.dialogoFormatoActa(); break;
    }

  }

  ngAfterViewInit() {
    this.dataTecnicos.sort = this.sortTecs;
    this.dataTecnicos.paginator = this.paginatorTecs;

    this.dataCaracteristica.paginator = this.paginatorCarac;
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

  

  guardarEdicion = () => {
    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      return;
    }
    switch(this.pCatalogo) {
      case 'Z': 
        let params: any = {};
        // Estados seleccionados
        let estadosSelects = [];
        this.listEstados.forEach(element => { if(element.estatus) { estadosSelects.push(element); } });
        
        params = this.generalForm.value;
        params.estados = estadosSelects;
        if(!estadosSelects.length) {
          this._snack.open("Seleccione algún estado", "", { duration: 2000, panelClass: ["snack-error"] });
          return false;
        }
        if(!this.dataTecnicos.data.length) {
          this._snack.open("Ingrese por lo menos un técnico", "", { duration: 2000, panelClass: ["snack-error"] });
          return false;
        }

        // Accion Guardar: 0 - Editar: 1
        params.accion = this.data.accion;
        //console.log("paramsZonas: ", params);
        this.ActionPostZonas(params, this.generalUrl);
        break;
      case 'EQ': 
        if(!this.dataCaracteristica.data.length) {
          this._snack.open("Ingrese por lo menos una característica", "", { duration: 2000, panelClass: ["snack-error"] });
          return false;
        }
        //console.log("dataEquipo: ", this.generalForm.value);
        //console.log("lista caracts: ", this.dataCaracteristica.data);
        this.ActionPostEquipos(this.generalForm.value, this.generalUrl);
        break;
      default: this.ActionPost(this.generalForm.value, this.generalUrl); break;
    }
  }

  ActionPost(item: any, url: string) {
    this.mostrarCarga();
    this._dataService.postData<any>(url, "", item)
    .pipe(
      finalize(() => { this.overlayRef.detach(); })
    )
    .subscribe(
      data => {
        this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
        if (data["SUCCESS"]) {
          this._dialogRef.close(true);
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

  ActionPostZonas(item: any, url: string) {
    this.mostrarCarga();
    let respuesta: any = {};
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        if (data["SUCCESS"]) {
          this.overlayRef.detach();
          // Mensaje de respuesta
          let varmsg = "";

          // Guardar Técnicos
          let countTecnicos = 0;
          let countTecnicosTtl = 0; // total de técnicos

          // Guardar Estados
          let countEstados = 0;
          let countEstadosTtl = 0; // total de estados

          /*********     Guardar Técnicos     ****************/
          if(this.dataTecnicos.data.length){
            this.mostrarCarga();
          }

          this.dataTecnicos.data.forEach(itemTecnico => {
            let detalleParams: any = { zona_id: this.data.accion ? item.id : data["ID"], empleado_id: itemTecnico.id, accion: this.data.accion };
            //console.log("tecnicos: ", detalleParams);
            this._dataService.postData<any>('catalogos/zonas/tecnicos/save', "", detalleParams)
            .pipe(
              finalize(() => { 
                countTecnicosTtl++;
                if(countTecnicosTtl == this.dataTecnicos.data.length) {

                  /*********     Guardar Estados     ****************/
                  if(!item.estados.length) {
                    this.overlayRef.detach();
                  }
                  item.estados.forEach(itemEstado => {
                    
                    let detalleParams: any = { zona_id: this.data.accion ? item.id : data["ID"], estado_id: itemEstado.id, accion: this.data.accion };
                    //console.log("estados: ", detalleParams);
                    this._dataService.postData<any>('catalogos/zonas/estados/save', "", detalleParams)
                    .pipe(
                      finalize(() => { 
                        countEstadosTtl++;
                        if(countEstadosTtl == item.estados.length) {
                          if(countTecnicos == countTecnicosTtl && countEstados == countEstadosTtl) {
                            varmsg = data["MESSAGE"];
                          }
                          if(countTecnicos != countTecnicosTtl && countEstados == countEstadosTtl) {
                            varmsg = "Se guardó la Zona pero algunos Técnicos no se guardaron correctamente";
                          }
                          if(countTecnicos == countTecnicosTtl && countEstados != countEstadosTtl) {
                            varmsg = "Se guardó la Zona pero algunos Estados no se guardaron correctamente";
                          }
                          if(countTecnicos != countTecnicosTtl && countEstados != countEstadosTtl) {
                            varmsg = "Se guardó la Zona pero algunos Técnicos y Estados no se guardaron correctamente";
                          }

                          this._snack.open(varmsg, "", { duration: 8000, panelClass: ["snack-ok"] });
                          this.overlayRef.detach();
                          this._dialogRef.close(true);
                        }
                      })
                    ).subscribe(dataE => { if(dataE["SUCCESS"]) { countEstados++; } }, errorE => { countEstados = countEstados; });
                  });
                  /***************************************************/
                }
              })
            ).subscribe(dataT => { if(dataT["SUCCESS"]) { countTecnicos++; } }, errorT => { countTecnicos = countTecnicos; });
            /***************************************************/
          });
        } else {
          this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
          this.overlayRef.detach();
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        this.overlayRef.detach();
      }
    );
  }

  ActionPostEquipos(item: any, url: string) {
    this.mostrarCarga();
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        if (data["SUCCESS"]) {
          
          // Mensaje de respuesta
          let varmsg = "";

          // Guardar Características
          let countCaracts = 0;
          let countCaracsTtl = 0; // Total de características
          let contEliminaBan = 1;

          /*********     Guardar Caracteristicas     ****************/
          this.dataCaracteristica.data.forEach(itemCaracter => {
            let detalleParams: any = { 
              equipo_id: this.data.accion ? item.id : data["ID"], 
              caracteristica: itemCaracter.caracteristica, 
              caracteristica_id: 0, 
              observaciones: itemCaracter.observaciones, 
              accion: this.data.accion,
              accioneliminar: contEliminaBan == 1 ? 1 : 0
            };
            this.filteredCaracteristicas.forEach(LstitemCaract => {
              if(LstitemCaract.caracteristica.toLowerCase() == itemCaracter.caracteristica.toLowerCase()){
                detalleParams.caracteristica_id = LstitemCaract.id;
              }
            });
           // console.log("Caracteristicas: ", detalleParams);
            this._dataService.postData<any>('catalogos/equipos/caracteristicas/save', "", detalleParams)
            .pipe(
              finalize(() => { 
                countCaracsTtl++;
                if(countCaracsTtl == this.dataCaracteristica.data.length) {
                  if(countCaracsTtl == countCaracts) {
                    varmsg = data["MESSAGE"];
                  }
                  if(countCaracsTtl != countCaracts) {
                    varmsg = "Se guardó el Equipo pero algunas Características no se guardaron correctamente, verifique que la caracteristica no se repita";
                  }

                  this._snack.open(varmsg, "", { duration: 8000, panelClass: ["snack-ok"] });
                  this.overlayRef.detach();
                  this._dialogRef.close(true);
                }
              })
            ).subscribe(dataC => { /*console.log("exito carac: ", dataC);*/ if(dataC["SUCCESS"]) { countCaracts++; } }, errorC => { countCaracts = countCaracts; /*console.log("error carac: ", errorC);*/ });
            /***************************************************/
            contEliminaBan++;
          });
        } else {
          this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
          this.overlayRef.detach();
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        this.overlayRef.detach();
      }
    );
  }

  //Filtros
  filtroEmpleado = () => {
    this.empleadoFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.empleadosList) { return []; }

          return this.empleadosList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredEmpleado => {
        this.searching = false;
        this.filteredEmpleados.next(filteredEmpleado);
      }, error => {
        this.searching = false;
      });
  }

  filtrarPor = (tipo = 0, event) => {
    let params: any = { buscar: event };
    let url = "";
    switch (tipo) {
      case 3: url = 'catalogos/coordinadores/combo'; break;
      case 4: url = 'catalogos/tiposServicios/combo'; break;
      case 5: url = 'catalogos/coordinadores/combo'; params = { buscar: event }; break;
      case 6: url = 'catalogos/tecnicos/combo'; params = { buscar: event }; break;
      case 7: url = 'catalogos/zonas/combo'; break;
      case 8: url = 'catalogos/gastos/combo'; break;
    }
    this.ObtenerCombos(url, tipo, params);
  }

  filtroZonas = () => {
    this.zonaFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.zonasList) { return []; }

          return this.zonasList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredZonas => {
        this.searching = false;
        this.filteredZonas.next(filteredZonas);
      }, error => {
        this.searching = false;
      });
  }

  filtroTecnicos = () => {
    this.tecnicoFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.tecnicosList) { return []; }

          return this.tecnicosList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredTecnico => {
        this.searching = false;
        this.filteredTecnicos.next(filteredTecnico);
      }, error => {
        this.searching = false;
      });
  }

  filtroTecnicosO = () => {
    this.tecnicosOFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.tecnicosOList) { return []; }

          return this.tecnicosOList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredTecnico => {
        this.searching = false;
        this.filteredTecnicosOList.next(filteredTecnico);
      }, error => {
        this.searching = false;
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
          if (!this.serviciosList) { return []; }

          return this.serviciosList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredServicio => {
        this.searching = false;
        this.filteredServicios.next(filteredServicio);
      }, error => {
        this.searching = false;
      });
  }

  filtroCoordinadores = () => {
    this.coordinadorFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.coordinadoresList) { return []; }

          return this.coordinadoresList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredCoordinador => {
        this.searching = false;
        this.filteredCoordinadores.next(filteredCoordinador);
      }, error => {
        this.searching = false;
      });
  }

  filtroGastos = () => {
    this.gastosFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.gastosList) { return []; }

          return this.gastosList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredGasto => {
        this.searching = false;
        this.filteredGastos.next(filteredGasto);
      }, error => {
        this.searching = false;
      });
  }

  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params)
      .pipe(finalize(() => { if (this.overlayRef != undefined) { this.overlayRef.detach(); } }))
      .subscribe(
        data => {
          switch (tipo) {
            case 1: this.listaTipos = data.DATA; break;
            case 2: this.listaEstatus = data.DATA; break;
            case 3: this.empleadosList = data.DATA; this.filtroEmpleado(); break;
            case 4: this.serviciosList = data.DATA; this.filtroServicios(); break;
            case 5: this.coordinadoresList = data.DATA; this.searching = false; this.filteredCoordinadores.next(this.coordinadoresList); break;
            case 6: this.tecnicosOList = data.DATA; this.searching = false; this.filteredTecnicosOList.next(this.tecnicosOList); //this.filtroTecnicos(); break;
            case 7: this.zonasList = data.DATA; this.filtroZonas(); break;
            case 8: this.gastosList = data.DATA; this.filtroGastos(); break;
            case 9: this.serviciosList = data.DATA; break;
            case 10: this.listEstados = data.DATA; break;
            // Obtener la lista de estados y los asignados a una Zona
            case 11: this.listEstados = data.DATA; break;
            // Obtener la lista de Técnicos asignados a una Zona
            case 12: 
              // Preparar datos para actualizar la tabla de técnicos seleccionados
              const listaTecnicos = this.dataTecnicos.data;
              data.DATA.forEach(item => { listaTecnicos.push(item); });
              this.dataTecnicos.data = listaTecnicos;
              this.generalForm.patchValue({tecnicos: this.dataTecnicos.data});
              break;
            case 13: 
              this.filteredCaracteristicas = data.DATA; console.log("caracts: ", data.DATA); break;
            case 14: 
              //const listaCaracts = this.dataCaracteristica.data;
              //data.DATA.forEach(item => { listaCaracts.push(item); });
              this.dataCaracteristica.data = data.DATA; console.log("caractsTabla: ", data.DATA); break;
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

  agregarCaracteristica = () => {
    let datos = this.dataCaracteristica.data;
    datos.push({ id: this.dataCaracteristica.data.length + 1, caracteristica: this.generalForm.value.caracteristica, observaciones: this.generalForm.value.observaciones });
    
    this.dataCaracteristica.data = datos;
  }

  eliminarCaracteristica = (registro) => {
    let list: any[];
    let index: any;
    
    list = this.dataCaracteristica.data;
    index = list.findIndex(local => local.id == registro.id);
    list.splice(index, 1);
    this.dataCaracteristica.data = list;
  }

  dialogoEstatus = () => {

    //Creación de formulario
    this.generalForm = this._fB.group({
      id: [this.estatus.id],
      nombre: [this.estatus.nombre, [Validators.maxLength(45), Validators.required]],
      tipo_id: [this.estatus.tipo_id, [Validators.required]],
      color: [this.estatus.color ? '#FFF' : '#000'],
      estatus: [this.estatus.estatus ? true : false]
    })

    this.generalUrl = "catalogos/estatus/save";

    //Popular combos
    this.ObtenerCombos('catalogos/tiposEstatus/combo', 1)

    if (this.data.accion > 0) {
      this.generalForm.patchValue(this.data.data);
    }
  }

  dialogoTipoDocumentos = () => {
    //Creación de formulario
    this.generalForm = this._fB.group({
      id: [this.tipoDocumento.id],
      nombre: [this.tipoDocumento.nombre, [Validators.maxLength(45), Validators.required]],
      fechaRegistro: [this.tipoDocumento.fechaRegistro],
      estatus: [this.tipoDocumento.estatus ? true : false]
    })

    this.generalUrl = "catalogos/tiposDocumentos/save";

    if (this.data.accion > 0) {
      //console.log("Editar", this.data.data);
      this.generalForm.patchValue(this.data.data);
    }
  }

  dialogoTipoServicios = () => {
    //Creación de formulario
    this.generalForm = this._fB.group({
      id: [this.tipoServicio.id],
      nombre: [this.tipoDocumento.nombre, [Validators.maxLength(45), Validators.required]],
      estatus: [this.tipoDocumento.estatus ? true : false]
    })

    this.generalUrl = "catalogos/tiposServicios/save";

    if (this.data.accion > 0) {
      //console.log("Editar", this.data.data);
      this.generalForm.patchValue(this.data.data);
    }
  }

  dialogoGastos = () => {
    //Creación de formulario
    this.generalForm = this._fB.group({
      id: [this.gasto.id],
      nombre: [this.gasto.nombre, [Validators.maxLength(20), Validators.required]],
      deducible: [this.gasto.deducible],
      fechaRegistro: [this.gasto.fechaRegistro]
    })

    this.generalUrl = "catalogos/gastos/save";

    if (this.data.accion > 0) {
      //console.log("Editar", this.data.data);
      this.generalForm.patchValue(this.data.data);
    }
  }

  dialogoTipoEstatus = () => {
    //Creación de formulario
    this.generalForm = this._fB.group({
      id: [this.gasto.id],
      nombre: [this.gasto.nombre, [Validators.maxLength(45), Validators.required]],
      estatus: [this.gasto.estatus ? true : false]
    })

    this.generalUrl = "catalogos/tiposEstatus/save";

    if (this.data.accion > 0) {
      //console.log("Editar", this.data.data);
      this.generalForm.patchValue(this.data.data);
    }
  }

  dialogoMotivoEstatus = () => {
    //Creación de formulario
    this.generalForm = this._fB.group({
      id: [this.motivoEstatus.id],
      nombre: [this.motivoEstatus.nombre, [Validators.maxLength(45), Validators.required]],
      estNombre: [this.motivoEstatus.estNombre],
      estatus_id: [this.motivoEstatus.estatus_id, [Validators.required]],
      tipoEstatus_id: [this.motivoEstatus.tipoEstatus_id, [Validators.required]],
      //catalogo: [this.motivoEstatus.catalogo, [Validators.required]],
      estatus: [this.motivoEstatus.estatus ? true : false],
    })

    this.generalUrl = "catalogos/motivos/save";

    //popular combos 
    let params: any = { opc: 10 }
    this.ObtenerCombos('catalogos/tiposEstatus/combo', 1, params);

    if (this.data.accion > 0) {
      this.mostrarCarga();
      let params: any = { opc: 13, id: this.data.data.tipoEstatus_id }
      this.ObtenerCombos('catalogos/estatus/combo', 2, params);
      this.generalForm.patchValue(this.data.data);
    }
  }

  selectTipoEstatus = (registro: any) => {
    let params: any = { opc: 13, id: registro.value };
    //console.log("Select registro: ", registro);
    this.ObtenerCombos('catalogos/estatus/combo', 2, params);
  }

  dialogoCoordinadores = () => {
    // Cargar filtros en los combos
    this.filtroCoordinadores();
    this.filtroTecnicos();

    //Creación de formulario
    this.generalForm = this._fB.group({
      empleado_id: [this.coordinador.empleado_id, [Validators.required]],
      nombre: [this.coordinador.nombre],
      estatus: [this.coordinador.estatus]
    })

    this.generalUrl = "catalogos/coordinadores/save";

    if (this.data.accion > 0) {
      this.empleadosList = [{ id: this.data.data.empleado_id, nombre: this.data.data.nombre }];
      this.filteredEmpleados.next(this.empleadosList);
      this.generalForm.patchValue(this.data.data);
    }
  }

  dialogoTecnicos = () => {
    //Creación de formulario
    this.generalForm = this._fB.group({
      empleado_id: [this.tecnico.empleado_id, [Validators.required]],
      nombre: [this.tecnico.nombre],
      zona_id: [this.tecnico.zona_id, [Validators.required]],
      zona: [this.tecnico.zona],
      estatus: [this.tecnico.estatus]
    })

    this.generalUrl = "catalogos/tecnicos/save";

    if (this.data.accion > 0) {
      //console.log("editar this.data.data", this.data.data);
      this.tecnicosList = [{ id: this.data.data.empleado_id, nombre: this.data.data.nombre }];
      this.filteredTecnicos.next(this.tecnicosList);
      this.generalForm.patchValue(this.data.data);
    }
  }

  dialogoZonas = () => {
    //Creación de formulario
    this.generalForm = this._fB.group({
      id: [this.zona.id],
      nombre: [this.zona.nombre, [Validators.required, Validators.maxLength(45)]],
      estatus: [this.zona.estatus],
      tipoServicio_id: [this.zona.tipoServicio_id, [Validators.required]],
      tipoServicio: [this.zona.tipoServicio],
      coordinador_id: [this.zona.coordinador_id, [Validators.required]],
      coordinador: [this.zona.coordinador],
      tecnicos: [this.zona.tecnicos]
    })

    this.generalUrl = "catalogos/zonas/save";

    let params: any = { opc: 10 }
    this.ObtenerCombos('catalogos/tiposServicios/combo', 9, params);

    if (this.data.accion > 0) {
      this.coordinadoresList = [{
        id: this.data.data.coordinador_id,
        nombre: this.data.data.coordinador
      }];
      this.filteredCoordinadores.next(this.coordinadoresList);
      this.generalForm.patchValue(this.data.data);

      let params: any = { id: 0, opc: 0 };
      
      // Obtener lista de tecnicos asignados a la Zona
      params.id = this.generalForm.value.id; // Zona_id
      params.opc = 1;
      this.ObtenerCombos('catalogos/zonas/tecnicos', 12, params);

      // Obtener lista de estados asignados a la zona
      params.id = this.generalForm.value.id;
      params.opc = 2;
      this.mostrarCarga();
      this.ObtenerCombos('catalogos/zonas/estados', 11, params);
      //this.obtenerEstado({ value: this.generalForm.value.tipoServicio_id});
    }

    this.filtroTecnicosO();
  }

  selectTecnicos = () => {
    let lista: any = [];
    //console.log("this.generalForm.get('tecnicos').value: ", this.generalForm.get("tecnicos").value);
    // Verificar que los técnicos seleccionados no se dupliquen
    if(this.generalForm.get("tecnicos").value != null) {
      this.generalForm.get("tecnicos").value.forEach(seleccionado => {
        if(!this.existe(seleccionado.nempleado)) {
          lista.push(seleccionado);
        }
      });
  
      // Preparar datos para actualizar la tabla de técnicos seleccionado
      const tecnicosLista = this.dataTecnicos.data;
      lista.forEach(item => {
        tecnicosLista.push(item);
      });
      this.dataTecnicos.data = [];
      this.dataTecnicos.data = tecnicosLista;
      //this.generalForm.patchValue({tecnicos: this.dataTecnicos.data});
    }
  }

  //Pendiente de que no se dupliquen los registros :/
  existe = (id: string): boolean => {
    let valido = false;
    this.dataTecnicos.data.map(reg => {
      if (reg.nempleado == id) {
        valido = true;
      }
    })
    return valido;
  }

  obtenerEstado = (registro) => {
    //console.log("registro: ", registro);
    let params: any = { serivicio_id: registro.value }
    this.ObtenerCombos('catalogos/zonas/estados/obtEstados', 10, params);
  };

  deteleFrom = (reg, tipo: number = 0) => {
    let list: any[];
    let index: any;

    list = this.dataTecnicos.data;
    index = list.findIndex(local => local.nempleado == reg.nempleado);
    list.splice(index, 1);
    this.dataTecnicos.data = list;
    this.generalForm.patchValue({tecnicos: this.dataTecnicos.data});
  }
  
  // Actualizar la tabla de técnicos seleccionado
  busqueda = (filtro: string) => {
    this.dataTecnicos.filter = filtro.trim().toLowerCase();
  }

  dialogoConceptos = () => {
    this.generalForm = this._fB.group({
      id: [this.concepto.id],
      gasto_id: [this.concepto.gasto_id, [Validators.required]],
      nombre: [this.concepto.nombre, [Validators.required, Validators.maxLength(45)]],
      estatus: [this.concepto.estatus],
      deducible: [this.concepto.deducible, [Validators.required]],
      cantidad: [this.concepto.cantidad, [Validators.required]]
    })
    this.generalUrl = "catalogos/gastosDetalle/save";

    if (this.data.accion > 0) {
      //Edición
      this.gastosList = [{
        id: this.data.data.gasto_id,
        nombre: this.data.data.gasto,
        fechaRegistro: "",
        deducible: this.data.data.deducible,
        estatus: this.data.data.estatus
      }];
      this.filteredGastos.next(this.gastosList);
      this.generalForm.patchValue(this.data.data);
    }

  }

  dialogoEquipos = () => {
    this.generalForm = this._fB.group({
      id: [this.equipo.id],
      nombre: [this.equipo.nombre, [Validators.required, Validators.maxLength(45)]],
      estatus: [this.equipo.estatus],
      caracteristica: [""],
      caracteristicas: [this.equipo.caracteristicas],
      observaciones: [""]
    })

    this.generalUrl = "catalogos/equipos/save";

    let params: any = { id: 0, opc: 0 };

      // Obtener lista de características
      params.opc = 1;
      this.ObtenerCombos('catalogos/equipos/caracteristicas/obtCaracts', 13, params);

    if (this.data.accion > 0) {
      //Edición
      this.generalForm.patchValue(this.data.data);
      //console.log("equipo edit ", this.data.data);

      // Obtener lista de características asignadas al Equipo
      params.id = this.generalForm.value.id;
      params.opc = 2;
      this.mostrarCarga();
      this.ObtenerCombos('catalogos/equipos/caracteristicas/obtCaracts', 14, params);
    }

  }

  dialogoMedios = () => {
    this.generalForm = this._fB.group({
      id: [this.concepto.id],
      nombre: [this.concepto.nombre, [Validators.required, Validators.maxLength(45)]],
      estatus: [this.concepto.estatus]
    })

    this.generalUrl = "catalogos/medios/save";

    if (this.data.accion > 0) {
      //Edición
      this.generalForm.patchValue(this.data.data);
    }

  }

  dialogoFormatoActa = () => {
    this.generalForm = this._fB.group({
      id: [this.formatoActa.id],
      nombre: [this.formatoActa.nombre, [Validators.required, Validators.maxLength(45)]],
      estatus: [this.formatoActa.estatus]
    })

    this.generalUrl = "catalogos/formatoActas/save";

    if (this.data.accion > 0) {
      //Edición
      this.generalForm.patchValue(this.data.data);
    }
  }
}

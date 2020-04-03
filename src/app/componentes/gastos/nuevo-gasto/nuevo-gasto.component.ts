import { Component, OnInit } from '@angular/core';
import { Concepto } from 'src/app/clases/Gastos/Concepto';
import { MatTableDataSource, MatDialog, MatSnackBar } from '@angular/material';
import { DialogoDividirMontoComponent } from '../dialogo-dividir-monto/dialogo-dividir-monto.component';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoProductosComponent } from '../dialogo-productos/dialogo-productos.component';
import { DialogoAgregarConceptoComponent } from '../dialogo-agregar-concepto/dialogo-agregar-concepto.component';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ReplaySubject, Subject, from } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, delay, finalize } from 'rxjs/operators';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { formatDate } from '@angular/common';
import { RouterLinkWithHref } from '@angular/router';

export interface Servicios {
  id: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  costo: number;
}

export class Empleado {
  id: number;
  nombre: string;
  nempleado: string;
  latitud: number;
  longitud: number;

  constructor() { }
}

export class TipoGasto {
  id: number;
  nombre: string;

  constructor() { }
}

@Component({
  selector: 'app-nuevo-gasto',
  templateUrl: './nuevo-gasto.component.html',
  styleUrls: ['./nuevo-gasto.component.scss']
})
export class NuevoGastoComponent implements OnInit {
  pro = [];

  lat: number = 20.653805;
  lng: number = -103.347631;

  latMark: number = null;
  lngMark: number = null;

  foliosData: any[] = [];

  deduciblesData: Concepto[] = [];

  EmpleadosList: Empleado[] = [];

  tipoGastoList: TipoGasto[] = []

  listServicios: Servicios[] = [];
  testList: any= [];

  tipoGastoGral: any[] = [
    /*{ nombre: "Administrativo", value: "Administrativo" },
    { nombre: "Operativo", value: "Operativo" }*/
  ];

  infoEdoCuenta: any = [] ;
  edoCuenta: any = [];

  hoy: string = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");

  odesColumns: string[] = ['select', 'noServicio', 'cliente', 'tipoS', 'estado', 'municipio'];
  odesData = new MatTableDataSource([]);
  selectionOdeS = new SelectionModel<any>(true, []);

  displayedColumnsServ: string[] = ['codigo', 'concepto', 'cantidad','total','actions'];
  dataSourceServ = new MatTableDataSource<Servicios>(this.listServicios);
  selectionServ = new SelectionModel<Servicios>(true, []);

  conceptosColumns: string[] = ['concepto', 'monto', 'gasto', 'dividido', 'actions'];
  conceptosDS = new MatTableDataSource();

  gastoForm: FormGroup;

  // Loader
  overlayRef: OverlayRef;

  //Getter general
  generalGetter = (_campo) => {
    return this.gastoForm.get(_campo);
  }

  public gastoFilteringCtrl: FormControl = new FormControl();
  public empleadoFilteringCtrl: FormControl = new FormControl();
  public nombreEmpleadosFilteringCtrl: FormControl = new FormControl();
  protected _onDestroy = new Subject<void>();
  public searching: boolean = false;
  public filteredGastoList: ReplaySubject<TipoGasto[]> = new ReplaySubject<TipoGasto[]>(1);
  public filteredNEmpleadosList: ReplaySubject<Empleado[]> = new ReplaySubject<Empleado[]>(1);
  public filteredEmpleadosList: ReplaySubject<Empleado[]> = new ReplaySubject<Empleado[]>(1);

  sessionData: any;
  constructor(private _dialog: MatDialog,
    private _fb: FormBuilder,
    private _dataService: GeneralService,
    private _overlay: Overlay,
    private _snack: MatSnackBar) {
      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 

    }

  ngOnInit() {

    this.gastoForm = this._fb.group({
      id: [''],
      folio: [{ value: this.hoy, disabled: true }, [Validators.required]],
      tipo_gasto: ['', [Validators.required]],
      n_empleado: ['', [Validators.required]],
      nombre_empleado: [{ value: '', disabled: true }, [Validators.required]],
      lat: [''],
      long: [''],
      odes: [[]],
      descripcion: ['', [Validators.required]],
      productos: [[], [Validators.required]],
      conceptos_gasto: [[], [Validators.required]],
      MontoGastoGeneral: [0],
      abono_adeudo: [0, [Validators.required, Validators.pattern('^\\s*(?=.*[0-9])\\d*(?:\\.\\d{1,2})?\\s*$')]],
      total_adeudo: [0, [Validators.pattern('^\\s*(?=.*[0-9])\\d*(?:\\.\\d{1,2})?\\s*$')]],
      total_depositado: [0, [Validators.pattern('^\\s*(?=.*[0-9])\\d*(?:\\.\\d{1,2})?\\s*$')]]
    });

    this.filtroEmpleados();
    this.estatusChanges();
    this.cargarDatos();

  }

  dialogoDividirGasto = (registro) => {
  
    const dialogRef = this._dialog.open(DialogoDividirMontoComponent, {
      panelClass: 'dialog-dividir',
      data: { data: {MontoTotal: registro.Monto, odesLista: this.selectionOdeS.selected, folios: registro.folios} }
    });
    /*const dialogRef = this._dialog.open(DialogoDividirMontoComponent, {
      panelClass: 'dialog-dividir',
      data: { data: {MontoTotal: registro.Monto, odesLista: this.selectionOdeS.selected, folios: registro.folios} }
    });
    */

    dialogRef.beforeClosed().subscribe((res) => {
      let lista: any = this.conceptosDS.data;
      if (res.data.length) {
        lista.forEach((item, index) => {
          if(item.id == registro.id) {
            item.folios = res.data;
          }
        });
        this.conceptosDS.data = lista;
      }
      registro.folios = res.data.length ? res.data : this.selectionOdeS.selected;
      registro.divididos = registro.folios.length;
      if(!res.data.length) {
        this.ObtenerDivididoCantidad(registro.folios, registro.Monto);
        lista.forEach((item, index) => {
          if(item.id == registro.id) {
            item = registro;
          }
        });
      }
      this.gastoForm.patchValue({ conceptos_gasto: this.conceptosDS.data });
    });
  }

  ObtenerDivididoCantidad = (odes = [], cantidad) => {
    let cantDecimales = cantidad / odes.length;
    let entero = 0;
    let diferencia = 0;
    entero = cantDecimales;
    if((cantDecimales + "").split(".").length > 1) {
      entero = parseInt((cantDecimales + "").split(".")[0]);
      diferencia = cantidad - entero * odes.length;
    }
    odes.forEach(item => {
      item.monto = entero;
    });
    
    if(odes.length) {
      odes[odes.length - 1].monto = odes[odes.length - 1].monto + diferencia;
    }
  }

  dialogoServicios = () => {
    if(!this.gastoForm.value.n_empleado) {
      return this._snack.open("Seleccione un cliente", "", { duration: 2000, panelClass: ["snack-error"] });
    }

    const dialogRef = this._dialog.open(DialogoProductosComponent, {
      panelClass: 'dialog-servicios',
      data: { datosEmpleado: this.gastoForm.value }
    })

    dialogRef.beforeClosed().subscribe((res) => {
      if (res.length) {
        let list: any[];
        list = this.gastoForm.value.productos;

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

        this.gastoForm.patchValue({ productos: list });
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

  dialogoNuevoConcepto = (_titulo: string, registro: any = null, nuevoBan = 0) => {
    if(!this.selectionOdeS.selected.length) {
      return this._snack.open("Seleccione un servicio", "", { duration: 2000, panelClass: ["snack-error"] });
    }

    const dialogRef = this._dialog.open(DialogoAgregarConceptoComponent, {
      panelClass: 'dialog-conceptos',
      data: { titulo: _titulo, odes: this.selectionOdeS.selected,  registro: registro, nuevo: nuevoBan }
    });

    dialogRef.afterClosed().subscribe(res => {
      let totalDepositado = 0;
      if (res.accion) {
        let lista: any = this.conceptosDS.data;
        let existe = lista.filter(local => local.Monto == res.Monto && local.Concepto == res.Concepto && local.TipoGasto == res.TipoGasto);
        if(existe.length) {
          return this._snack.open("Ya existe un Concepto con los datos especificados", "", { duration: 2000, panelClass: ["snack-error"] });
        }

        if(res.data.id) {
          lista.forEach((item, index) => {
          //  totalDepositado += item.Monto;
            if(item.id == res.data.id) {
             let afterMonto = item.Monto;
             item.Monto = res.data.Monto
             totalDepositado = (this.gastoForm.value.total_depositado - afterMonto) + item.Monto;
             item.TipoGasto = res.data.TipoGasto;
             item = res.data;
            
            }
          });
        } else {
          this.conceptosDS.data.push(res.data);
          lista = this.conceptosDS.data;
          lista.forEach((item, index) => {
            item.id = index + 1;
            totalDepositado += item.Monto;
          });
        }
        this.conceptosDS.data = lista;
        this.gastoForm.patchValue({ conceptos_gasto: this.conceptosDS.data });
        this.gastoForm.patchValue({ MontoGastoGeneral: totalDepositado });
        let abonoAd = this.gastoForm.value.abono_adeudo ? this.gastoForm.value.abono_adeudo : 0;
        this.gastoForm.patchValue({ total_depositado: totalDepositado - abonoAd });
      }
    })
  }

  eliminarConcepto = (reg) => {
    let list: any[];
    let index: any;

    list = this.conceptosDS.data;
    index = list.findIndex(local => local.id == reg.id);
    list.splice(index, 1);
    this.gastoForm.patchValue({ conceptos_gasto: list });
  }

  busqueda = (filtro: string) => {
    this.odesData.filter = filtro.trim().toLowerCase();
  }

  estatusChanges = () => {
    this.gastoForm.get('odes').valueChanges.subscribe(reg => {
      this.odesData.data = reg;
    })

    this.gastoForm.get('productos').valueChanges.subscribe(reg => {
      this.dataSourceServ.data = reg;
    })

    this.gastoForm.get('conceptos_gasto').valueChanges.subscribe(reg => {
      this.conceptosDS.data = reg;
    })

    this.gastoForm.get('abono_adeudo').valueChanges.subscribe(reg => {
      if(reg != null) {
        let resultado =  this.gastoForm.value.MontoGastoGeneral;
        resultado = resultado - reg;
        this.gastoForm.patchValue({ total_depositado: resultado });
      }
    })

  }

  selectEmpleado = (seleccion: any) => {
    this.EmpleadosList.forEach(item => {
      if(item.id == seleccion.value) {
        this.latMark = item.latitud;
        this.lngMark = item.longitud;
        
        if(item.latitud || item.longitud) {
          this.lat = item.latitud;
          this.lng = item.longitud;
        }
        this.gastoForm.patchValue({ nombre_empleado: (item.nempleado ? item.nempleado + " - " : "") + item.nombre });
      }
    });
    this.mostrarCarga();
    this.ObtenerCombos('gastos/empleado/servicios', 3, { id: seleccion.value }, 1);
    this._dataService.postData('gastos/empleado/adeudo','',{id:seleccion.value}).subscribe( data => {
     (data["DATA"])[0].TotalAdeudo == null ? (this.gastoForm.patchValue({ total_adeudo: 0})):(
       this.gastoForm.patchValue({ total_adeudo: Number((data["DATA"])[0].TotalAdeudo)}));
})
    this.ObtenerCombos('gastos/empleados/solInfo',6,{id:seleccion.value });
    //this.ObtenerCombos('gastos/empleado/productos', 4, { id: seleccion.value });
  }

  cargarDatos = () => {
    this.ObtenerCombos('gastos/tipoGasto/combo', 5);
    this.mostrarCarga();
    this.ObtenerCombos('gastos/empleados/combo', 2, null, 1);
  
        
  }

  filtroEmpleados = () => {
    this.empleadoFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.EmpleadosList) { return []; }

          return this.EmpleadosList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredEmpleado => {
        this.searching = false;
        this.filteredNEmpleadosList.next(filteredEmpleado);
        this.testList = filteredEmpleado;
      }, error => {
        this.searching = false;
      });
  }

  actualizaLista = () => {
    if(!this.testList.length) {
      this.filteredNEmpleadosList.next(this.EmpleadosList);
    }
  }

  filtroNombreEmpleados = () => {
    this.nombreEmpleadosFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.EmpleadosList) { return []; }

          return this.EmpleadosList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredEmpleado => {
        this.searching = false;
        this.filteredEmpleadosList.next(filteredEmpleado);
      }, error => {
        this.searching = false;
      });
  }

  filtroTipoGastos = () => {
    this.gastoFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        map(search => {
          if (!this.tipoGastoList) { return []; }

          return this.tipoGastoList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        })
      )
      .subscribe(filteredGasto => {
        this.searching = false;
        this.filteredGastoList.next(filteredGasto);
      }, error => {
        this.searching = false;
      });
  }

  filtrarPor = (tipo = 0, event) => {
    let params: any = { };
    let url = "";
    switch (tipo) {
      case 1: url = 'gastos/empleados/combo'; params.buscar = event.target.value; tipo = 2; break;
    }
    this.mostrarCarga();
    this.ObtenerCombos(url, tipo, params, 1);
  }

  // Consumir servicio para obtener info de inputs, selects, listas, tablas
  ObtenerCombos(url: string, tipo = 0, params: any = null, stopLoader = 0) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        if(stopLoader) {
          this.overlayRef.detach();
        }
        switch (tipo) {
          case 1:
            this.tipoGastoList = data.DATA; this.filtroTipoGastos();
            break;
          case 2:
            this.EmpleadosList = data.DATA; this.searching = false; this.filteredNEmpleadosList.next(this.EmpleadosList);
            break;
          case 3: // Ordenes de servicio del empleado seleccionado
            this.odesData.data = data.DATA;
            break;
          case 4: // Obtener lista de productos del empleado seleccionado
            //this.dataSourceServ.data = data.DATA;
            //console.log("this.dataSourceServ ", this.dataSourceServ.data);
            break;
          case 5: // Obtener lista de Tipo de Gasto
            this.tipoGastoGral = data.DATA;
            break;
          case 6 :
            this.infoEdoCuenta = data.DATA ;
            break;
          case 7:
            this.edoCuenta = data.DATA; 
            if((this.edoCuenta[0]).TotalAdeudo == null || (this.edoCuenta[0]).TotalAdeudo == undefined)
            {
              this.gastoForm.patchValue({total_adeudo:0});
            }
            else
            {
              this.gastoForm.patchValue({total_adeudo:parseFloat((this.edoCuenta[0]).TotalAdeudo)});
            }
          default:
            break;
        }
      },
      error => {
        if(stopLoader) { this.overlayRef.detach(); }
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

  deteleFrom = (reg, tipo: number = 0) => {
    let list: any[];
    let index: any;

    switch (tipo) {
      case 1:
        list = this.gastoForm.get("productos").value as Servicios[];
        //this.gastoForm.patchValue({ productos: servicios });
        index = list.findIndex(local => local.codigo == reg.codigo);
        this.totalProd.delete(reg.id);
        list.splice(index, 1);
        this.gastoForm.patchValue({ productos: list });
        break;
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

  totalProd = new Map();
  agregarProd(row, event){
    this.totalProd.set(row.id,event);
  }


  actualizar = () => {
    if(this.infoEdoCuenta.length != 0)
    {
      this.ObtenerCombos('gastos/empleado/edoCuenta',7,{id:(this.infoEdoCuenta[0]).ID });
    }
    else
    {
      this._snack.open("No se ha elegido un empleado", "", { duration: 2000, panelClass: ["snack-error"] });
    }
  }

  guardarGasto = () => {
    let params: any = {};
    params.folio = this.hoy;
    params.tipo_gasto = this.gastoForm.value.tipo_gasto;
    params.n_empleado = this.gastoForm.value.n_empleado;
    params.abono_adeudo = this.gastoForm.value.abono_adeudo;
    params.total_adeudo = this.gastoForm.value.total_adeudo;
    params.total_depositado = this.gastoForm.value.total_depositado;
    params.descripcion = this.gastoForm.value.descripcion;
    params.usuario_id = this.sessionData.IdUsuario;
    if (!this.gastoForm.valid) {
      this.gastoForm.markAllAsTouched();
      this._snack.open("Faltan campos obligatorios", "", { duration: 2000, panelClass: ["snack-error"] });
      return false;
    }

    if(!this.selectionOdeS.selected.length) {
      return this._snack.open("Seleccione un servicio", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    
    this.mostrarCarga();
    let sizeOdes  = this.selectionOdeS.selected.length;
    let sizePro = this.gastoForm.value.productos.length;
    let tanGasto = this.gastoForm.value.conceptos_gasto.length;
    /*********     Guardar Datos Generales del nuevo Gasto     ****************/
    this._dataService.postData<any>('gastos/nuevoGasto/save', "", params)
    .subscribe(
      data => {
        // Validar nuevo Gasto
        if(data["SUCCESS"]) {
          ////////////////////////////////////////////////////////////////////
          //        Guardar lista de Servicios, Productos y Conceptos       //
          ////////////////////////////////////////////////////////////////////

          // banderas para saber si el registro enviado se guardó en base de datos
          let banServicos = 0;
          let banConcetos = 0;
          let banConcetosDetalle = 0;
          let banProductos = 0;

          // contar los registros en la lista del formulario
          let contServicos = 0;
          let contConceptos = 0;
          let contConceptosDetalle = 0;
          let contProductos = 0;
          let tempConceptoId = 0;

          let conceptoActual: any = {};

          // Guardar mensaje final de respuesta (alert)
          let varmsg = "";
          let txtErrorDetalle = "";
          /*********     Guardar Servicios     ****************/
          this.selectionOdeS.selected.forEach(elementOdeS => {
            let paramGastoDetalle: any = { gasto_id: data["ID"], servicio_id: elementOdeS.id, usuario_id: this.sessionData.IdUsuario };
          
            this._dataService.postData<any>('gastos/nuevoGasto/OdeS/save', "", paramGastoDetalle)
            .pipe(
              finalize(() => {
                contServicos++;
                if(contServicos == this.selectionOdeS.selected.length) {

                  /*********     Guardar Productos     ****************/
                  this.gastoForm.value.productos.forEach(elementProducto => {
                    let paramGastoDetalle: any = { gasto_id: data["ID"], producto_id: elementProducto.id, cantidad: elementProducto.cantidad,total: this.totalProd.get(elementProducto.id), usuario_id: this.sessionData.IdUsuario };
                    this._dataService.postData<any>('gastos/nuevoGasto/productos/save', "", paramGastoDetalle)
                    .pipe(
                      finalize(() => {
                        contProductos++;
                        if(contProductos == this.gastoForm.value.productos.length) {

                          /*********     Guardar Conceptos     ****************/
                          this.gastoForm.value.conceptos_gasto.forEach(elementConcepto => {
                            let paramGastoDetalle: any = { 
                              concepto_id: elementConcepto.Concepto, monto: elementConcepto.Monto, gasto_id: data["ID"], usuario_id: this.sessionData.IdUsuario
                            };
                            this._dataService.postData<any>('gastos/nuevoGasto/conceptos/save', "", paramGastoDetalle)
                            .pipe(
                              finalize(() => {
                                contConceptos++;
                                if(contConceptos == this.gastoForm.value.conceptos_gasto.length) {

                                  /*********     Guardar Conceptos Detalle     ****************/
                                    if(conceptoActual.hasOwnProperty("folios")) {
                                      conceptoActual.folios.forEach(ConceptoDetalle => {
                                        let paramGastoDetalle: any = { 
                                          gasto_concepto_id: tempConceptoId, servicio_id: ConceptoDetalle.id, monto: ConceptoDetalle.monto, usuario_id: this.sessionData.IdUsuario
                                        };
                                        
                                        
                                        this._dataService.postData<any>('gastos/nuevoGasto/conceptosDetalle/save', "", paramGastoDetalle)
                                        .pipe(
                                          finalize(() => {

                                            
                                            if (banServicos != sizeOdes) {
                                              varmsg += ". Algunos Servicios no se guardaron";
                                            }
                                            if (banProductos != sizePro) {
                                              varmsg += ". Algunos Productos no se guardaron";
                                            }
                                            if (banConcetos != tanGasto) {
                                              varmsg += "Algunos Conceptos no se guardaron sin folios divididos";
                                            }
                                                                                     
                                            contConceptosDetalle++;
                                            varmsg = data["MESSAGE"];
                                            this.overlayRef.detach();
                                            this.selectionOdeS.clear();
  
                                            this.gastoForm.reset();
                                            this.gastoForm.patchValue({odes: []});
                                            this.gastoForm.patchValue({productos: []});
                                            this.gastoForm.patchValue({conceptos_gasto: []});
                                            this.hoy = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");
                                            this.gastoForm.patchValue({folio: this.hoy});
                                            this.gastoForm.patchValue({abono_adeudo: 0});
                                            this.gastoForm.patchValue({total_adeudo: 0});
                                            this.gastoForm.patchValue({total_depositado: 0});
                                            this._snack.open(varmsg, "", { duration: 8000, panelClass: ["snack-ok"] });
                                              
                                          })
                                        )
                                        .subscribe( 
                                          dataConcDetalle => { 
                                            if(dataConcDetalle["SUCCESS"]) { banConcetosDetalle++; } }, 
                                            errorConcDetalle => { banConcetosDetalle = banConcetosDetalle; txtErrorDetalle = ". Algunos Folios no se guardaron al dividir el monto del Concepto" } );
                                      });
                                    } else {
                                  
                                          varmsg = data["MESSAGE"];
                                          this.overlayRef.detach();
                                          this.selectionOdeS.clear();

                                          this.gastoForm.reset();
                                          this.gastoForm.patchValue({odes: []});
                                          this.gastoForm.patchValue({productos: []});
                                          this.gastoForm.patchValue({conceptos_gasto: []});
                                          this.hoy = formatDate(Date.now(), "yyyyMMddHHmmssSS", "en-US");
                                          this.gastoForm.patchValue({folio: this.hoy});
                                          this._snack.open(varmsg, "", { duration: 8000, panelClass: ["snack-ok"] });
                                    }
                                  /***************************************************/

                                }
                              })
                            )
                            .subscribe( dataConc => { 
                              if(dataConc["SUCCESS"]==1) { banConcetos++; tempConceptoId = dataConc["ID"]; conceptoActual = elementConcepto; } }, errorConc => { banConcetos = banConcetos; } );
                          });
                          /***************************************************/

                        }
                      })
                    )
                    .subscribe( 
                      dataProd => {
                        if(dataProd["SUCCESS"]== 1) { banProductos++; } }, errorProd => { banProductos = banProductos; } );
                  });
                  /***************************************************/

                }
              })
            )
            .subscribe( 
              dataServicio => { 
              if(dataServicio["SUCCESS"]==1) { banServicos++; } }, errorServicio => { banServicos = banServicos; } );
          });
                  
        } else {
          this.overlayRef.detach();
          this._snack.open(data["MESSAGE"], "", { duration: 8000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
        }
      },
      error => {
        this.overlayRef.detach();
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );

  }

}

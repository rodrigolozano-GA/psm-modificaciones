import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { finalize } from 'rxjs/operators';
import { DialogoSeleccionServiciosComponent } from '../dialogo-seleccion-servicios/dialogo-seleccion-servicios.component';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';

export interface Inventario {
  id: number;
  nombre: string;
  cantidad: number;
}

@Component({
  selector: 'app-dialogo-tecnico',
  templateUrl: './dialogo-tecnico.component.html',
  styleUrls: ['./dialogo-tecnico.component.scss']
})
export class DialogoTecnicoComponent implements OnInit {

  nombre: string = "";
  lat: number = 20.653805;
  lng: number = -103.347631;

  latMark: number = null;
  lngMark: number = null;

  ELEMENT_DATA: any[] = [];
  edoCuenta: any[] = [];
  actualiza: boolean = false;
  editar: boolean = true;
  estadoCuentasList: any[] = [
    //{ tipo: "as", fecha: "fecha", folio: "folio", banco: "banco", referencia: "referencia", estatus: "estatus", importeFactura: "importeFactura", importePago: "importePago", parcialidades: "parcialidades" }
  ];

  inventarioList: Inventario[] = [];
  displayedColumns: string[] = ['nombre', 'cantidad'];
  displayedColumnsRefa: string[] = ['concepto', 'cantidad', 'actions'];
  estadoCuentasColumn: string[] = ['fecha', 'serie', 'folio', 'referencia', 'iddocumento', 'concepto', 'total'];  
  
  dataSource = new MatTableDataSource(this.inventarioList);
  dataSourceRefacciones = new MatTableDataSource(this.ELEMENT_DATA);
  dataEstadoCuentas = new MatTableDataSource(this.estadoCuentasList);  

  @ViewChild('tableInv', { static: true }) sort: MatSort;
  @ViewChild('tableRef', { static: true }) sortRef: MatSort;
  @ViewChild('invPaginator', { static: true }) paginator: MatPaginator;
  @ViewChild('refPaginator', { static: true }) paginatorRef: MatPaginator;
  selection = new SelectionModel<Inventario>(false, []);

  formInventario: FormGroup;

  overlayRef: OverlayRef;

  datosTecnico: any = {};

  sessionData: any;

  constructor(
    public _dialogRef: MatDialogRef<DialogoTecnicoComponent>,
    private _dialog: MatDialog,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _fb: FormBuilder,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
      this.datosTecnico = this.data.tecnico;
      if(this.data.hasOwnProperty("folio")){
        this.datosTecnico.folio_id = this.data.folio;
      }
      if(this.data.hasOwnProperty("estatusName")){
        this.editar = this.data.estatusName == 'en proceso' ? true : false;
    }
    //console.log("this.datosTecnico ", this.datosTecnico);
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.dataSourceRefacciones.sort = this.sortRef;
    this.dataSourceRefacciones.paginator = this.paginatorRef;

    this.formInventario = this._fb.group({
      nombre: [{ value: '', disabled: true }],
      n_empleado: [{ value: '', disabled: true }],
      puesto: [{ value: '', disabled: true }],
      zona: [{ value: '', disabled: true }],
      lat: [''],
      long: [''],
      inventario: [this.inventarioList],
      consecutivo: [{ value: '', disabled: true }],
      tipo_gasto: [{ value: "Comprobar", disabled: true }],
      referencia: [{ value: '', disabled: true }],
      total: [{ value: 1234567890, readonly: true }]
    });

    this.formChange();
    this.cargaDatos();

  }

  busqueda = (filtro: string) => {
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  busquedaRef = (filtro: string) => {
    this.dataSourceRefacciones.filter = filtro.trim().toLowerCase();
  }

  cargaDatos = () => {
    this.mostrarCarga();
    let params: any = { id: this.datosTecnico.id_ztt,idInventario: this.datosTecnico.idInventario, idEdoCuenta:this.datosTecnico.idEdoCuenta };

    this.ObtenerDatos('mesaControl/seguimiento/tecnicoFolio/detalle', params, 1);
    this.ObtenerDatos('mesaControl/seguimiento/tecnicoFolio/detalleInventario', params, 2);
    this.ObtenerDatos('mesaControl/seguimiento/tecnicoFolio/edoCuenta',params,4)
    if(this.data.hasOwnProperty("folio")){
      params.folio = this.datosTecnico.folio_id;
      this.ObtenerDatos('mesaControl/seguimiento/tecnicoFolio/detalleRefacciones', params, 3);
    }
  }

  formChange = () => {
    this.formInventario.get('inventario').valueChanges.subscribe(reg => {
      this.dataSource.data = reg;
    })
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

  ObtenerDatos = (url: string, params: any = null, tipo = 0) => {
    this._dataService.postData<any[]>(url, "", params).subscribe(
      data => {
        this.overlayRef.detach();
        if(data["SUCCESS"]) {
          switch(tipo) {
            case 1:
              if(data["DATA"].length > 0) {
                this.nombre = data["DATA"][0].numero_empleado + ' - ' + data["DATA"][0].nombre;
                this.formInventario.patchValue({ nombre: data["DATA"][0].nombre});
                this.formInventario.patchValue({ n_empleado: data["DATA"][0].numero_empleado });
                this.formInventario.patchValue({ puesto: data["DATA"][0].puesto });
                this.formInventario.patchValue({ zona: data["DATA"][0].zona });
                this.formInventario.patchValue({ lat: data["DATA"][0].latitud != null ? data["DATA"][0].latitud  : 20.653805 });
                this.formInventario.patchValue({ long: data["DATA"][0].longitud != null ? data["DATA"][0].longitud : -103.347631 });

                this.latMark = data["DATA"][0].latitud;
                this.lngMark = data["DATA"][0].longitud;

                if(data["DATA"][0].latitud || data["DATA"][0].longitud) {
                  this.lat = data["DATA"][0].latitud;
                  this.lng = data["DATA"][0].longitud;
                }
              }
              break;
            case 2: this.dataSource.data = data["DATA"]; break;
            case 3: 
              this.dataSourceRefacciones.data = data["DATA"];
              this.dataSourceRefacciones.data.forEach(item => {
                item.nuevo = 0;
              });
              break;
            case 4:
              this.dataEstadoCuentas.data = data["DATA"];
              break;
              
          }
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

  dialogoAgregarRefacciones = () => {
    const dialogRef = this._dialog.open(DialogoSeleccionServiciosComponent, {
      panelClass: "dialog-servicios",
      data: { data: {cliente_id: this.datosTecnico.id_ztt, url: "mesaControl/seguimiento/tecnicoFolio/obtRefaccionesTecnico"} }
    })

    dialogRef.beforeClosed().subscribe((res) => {
      if (res.length) {
        let list: any[];
        list = this.dataSourceRefacciones.data;

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
        this.dataSourceRefacciones.data = [];
        this.dataSourceRefacciones.data = list;
      }
    })
  }

  //Pendiente de que no se dupliquen los registros :/
  existe = (id: number): boolean => {
    let valido = false;
    this.dataSourceRefacciones.data.map(reg => {
      if (reg.id == id) {
        valido = true;
      }
    })
    return valido;
  }

  deteleFrom = (reg) => {
    //console.log("registro a eliminar", reg);
    let list: any[];
    let index: any;

    list = this.dataSourceRefacciones.data as any[];
    if(reg.nuevo) {
      index = list.findIndex(local => local.codigo == reg.codigo);
      list.splice(index, 1);
      this.dataSourceRefacciones.data = [];
      this.dataSourceRefacciones.data = list;
    } else {
      // eliminar refacción del folio
      const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
        panelClass: 'dialog-confirmaciones',
        data: { title: "Eliminar", text: `Esta refacción ya se utiliza en un folio. ¿Está seguro de eliminar la refacción seleccionada?`, cancelAction: "NO", okAction: "SI" }
      })
  
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          this.eliminarRefaccion(reg);
        }
      });
    }
  }

  guardar = () => {
    if(!this.dataSourceRefacciones.data.length) {
      return this._snack.open("Seleccione al menos una refacción", "", { duration: 8000, panelClass: ["snack-error"] });      
    }
    this.ActionPost();
  }

  eliminarRefaccion = (reg: any = null) => {
    let params = { opc: 2, id: reg.id };
    this.mostrarCarga();
    this._dataService.postData<any[]>("mesaControl/seguimiento/tecnicoFolio/RefaccionesDel", "", params).subscribe(
      data => {
        if(data["SUCCESS"]) {
          this.actualiza = true;
          this.ObtenerDatos('mesaControl/seguimiento/tecnicoFolio/detalleInventario', {id: this.datosTecnico.id_ztt}, 2);
          this.ObtenerDatos('mesaControl/seguimiento/tecnicoFolio/detalleRefacciones', {id: this.datosTecnico.id_ztt, folio: this.datosTecnico.folio_id}, 3);
        }
        this._snack.open(data["MESSAGE"], "", { duration: 8000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
      }, 
      error => { 
        this._snack.open("Error al conectarse con el servidor", "", { duration: 8000, panelClass: ["snack-error"] }); this.overlayRef.detach();
       }
    );
  }
  
  ActionPost = () => {
    let params: any = { 
      usuario_id: this.sessionData.IdUsuario, 
      folio_id: this.datosTecnico.folio_id 
    };
    
    params.empleado = this.datosTecnico.id;
    
    // Mensaje de respuesta
    let varmsg = "";
    let contRefaTtl = 0; // total a guardar
    let contRefa = 0; // enviadas con éxito
    let countNews = 0;

    let tipoError = true;

    this.mostrarCarga();
    this.dataSourceRefacciones.data.forEach(item => {
      let countNews = 0;
      if(item.nuevo == 1){
        params.refaccion = item.id;
        params.cantidad = item.cantidad;
        this._dataService.postData<any[]>("mesaControl/seguimiento/tecnicoFolio/RefaccionesSave", "", params)
        .pipe( 
          finalize (() => {

          contRefaTtl++;
          countNews++;

          if((contRefaTtl == this.dataSourceRefacciones.data.length) || (countNews != 0)) 
          {
            this.overlayRef.detach();
            if(contRefa != contRefaTtl && contRefa != 0) {
              varmsg = "Algunas refacciones no se guardaron correctamente";
              tipoError = true;
            }
            if(contRefa == 0) {
              tipoError = false;
            }
            //this._snack.open(varmsg, "", { duration: 8000, panelClass: [tipoError ? "snack-ok" : "snack-error"] });
            if(contRefa != 0) {
              this._dialogRef.close(true);
            }
          }
        }))
        .subscribe(
          data => { 
            if(data["SUCCESS"] == 1)
            { 
              contRefa++; 
              varmsg = data["MESSAGE"];
              //this._snack.open(varmsg, "", { duration: 8000, panelClass: [tipoError ? "snack-ok" : "snack-error"] });
            } 
          }, 
          error => { 
            contRefa = contRefa; 
            varmsg = "Error al conectar con el servidor"; 
            //this._snack.open(varmsg, "", { duration: 8000, panelClass: [tipoError ? "snack-ok" : "snack-error"] });
          }
        );
        }
    });
    this._snack.open("Información almacenada con éxito", "",
    {
      duration: 2000,
      panelClass: ["snack-ok"]
    });

//    this._snack.open(varmsg, "", { duration: 8000, panelClass: [tipoError ? "snack-ok" : "snack-error"] });

  }

  cerrar = () => {
    this._dialogRef.close(this.actualiza);
  }

}

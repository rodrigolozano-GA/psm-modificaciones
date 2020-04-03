import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { DialogoDividirMontoComponent } from '../dialogo-dividir-monto/dialogo-dividir-monto.component';
import { ReplaySubject, Subject } from 'rxjs';
import { ConceptoList } from 'src/app/clases/Gastos/Concepto';
import { FormControl } from '@angular/forms';
import { filter, tap, takeUntil, debounceTime, map, delay } from 'rxjs/operators';
import { GeneralService } from '../../../servicios/general/general.service';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

@Component({
  selector: 'app-dialogo-agregar-concepto',
  templateUrl: './dialogo-agregar-concepto.component.html',
  styleUrls: ['./dialogo-agregar-concepto.component.scss']
})
export class DialogoAgregarConceptoComponent implements OnInit {

  tiposGastos = [
    /*{ id: 0, nombre: "No Deducible" },
    { id: 1, nombre: "Deducible" }*/
  ]

  conceptosList: ConceptoList[] = [
    /*{ id: 1, nombre: "Gasolina" },
    { id: 2, nombre: "Hospedaje" },
    { id: 3, nombre: "Alimentos" },
    { id: 4, nombre: "Pintura" },
    { id: 5, nombre: "Herramientas" },
    { id: 6, nombre: "Refacciones para autos" }*/
  ]

  folios: any[] = [];
  odesLista: any = [];
  public conceptosFilteringCtrl: FormControl = new FormControl();
  public filteredConceptos: ReplaySubject<ConceptoList[]> = new ReplaySubject<ConceptoList[]>(1);
  
  protected _onDestroy = new Subject<void>();
  public searching: boolean = false;
  
  titulo : string = "";
  MontoTotal: number = 0;
  TipoGasto: number = 0;
  Concepto: number = 0;
  nuevo: number = 0;

  overlayRef: OverlayRef;

  constructor(
    public _dialogRef: MatDialogRef<DialogoDividirMontoComponent>,
    private _dialog: MatDialog, 
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.titulo = this.data.titulo;
    this.odesLista = this.data.odes;
    if(this.data.hasOwnProperty("nuevo")){
      switch(this.data.nuevo) {
        case 1: 
          this.MontoTotal = this.data.registro.Monto;
          this.TipoGasto = this.data.registro.TipoGasto;
          this.Concepto = this.data.registro.Concepto;
          this.folios = this.data.registro.folios;
          this.data.id = this.data.registro.id;
          this.mostrarCarga();
          this.ObtenerCombos('gastos/conceptosGasto/concepto/combo', 2, { id: this.data.registro.TipoGasto, tipo: 2 }, 1);
          break;
      };
    }
   }

  ngOnInit() {
    this.filtroConceptos();
    if(!this.data.hasOwnProperty("nuevo"))
      this.mostrarCarga();
    this.ObtenerCombos('gastos/tipoGasto/concepto/combo', 1, null, this.data.hasOwnProperty("nuevo") ? 0 : 1);
  }

  dialogoDividir = () => {
    if(!this.MontoTotal) {
      return this._snack.open("Ingrese un monto", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    this.odesLista[0].monto = this.MontoTotal;
    let dialogRef = this._dialog.open(DialogoDividirMontoComponent, {
      panelClass: 'dialog-dividir',
      data: { data: {MontoTotal: this.MontoTotal, odesLista: this.odesLista, folios: this.folios} }
    })

    dialogRef.afterClosed().subscribe(res => {
      this.folios = res.data;
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

  filtroConceptos = () => {
    this.conceptosFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.conceptosList) { return []; }

          return this.conceptosList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredCoordinador => {
        this.searching = false;
        this.filteredConceptos.next(filteredCoordinador);
      }, error => {
        this.searching = false;
      });
  }

  LlenarFilto = (event) => {
    if(event == "") {
      this.filteredConceptos.next(this.conceptosList);
    }
  }

  selectDeducible = (seleccion: any) => {
    this.mostrarCarga();
    this.ObtenerCombos('gastos/conceptosGasto/concepto/combo', 2, { id: seleccion.value, tipo: 2 }, 1);
  }

  // Consumir servicio para obtener info de inputs, selects, listas, tablas
  ObtenerCombos(url: string, tipo = 0, params: any = null, stoploader = 0) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        if(stoploader) {
          this.overlayRef.detach();
        }
        switch (tipo) {
          case 1:
            this.tiposGastos = data.DATA;
            break;
          case 2:
            this.conceptosList = data.DATA; this.searching = false; this.filteredConceptos.next(this.conceptosList);
            break;
          default:
            break;
        }
      },
      error => {
        this.overlayRef.detach();
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

  cancelarDatos = () => {
    this._dialogRef.close({ accion: false });
  }

  guardarDatos = () => {
    let expReg = /^\s*(?=.*[1-9])\d*(?:\.\d{1,2})?\s*$/;
    if(!expReg.test(this.MontoTotal + "")) {
      return this._snack.open("La cantidad del monto no es válida", "", { duration: 8000, panelClass: ["snack-error"] });
    }

    let nombreCon = this.conceptosList.filter(item => { return item.id == this.Concepto});
    let nombreTGas = this.tiposGastos.filter(item => { return item.id == this.TipoGasto});
    
    let params: any = {};
    params.id = this.data.hasOwnProperty("id") ? this.data.id : 0;
    params.TipoGasto = this.TipoGasto;
    params.txtTipoGasto = nombreTGas.length ? nombreTGas[0].nombre : "";
    params.Concepto = this.Concepto;
    params.txtConcepto = nombreCon.length ? nombreCon[0].nombre : "";
    params.Monto = this.MontoTotal;
    params.folios = this.folios.length ? this.folios : this.odesLista;
    params.divididos = params.folios.length;

    if(!this.folios.length) {
      this.ObtenerDivididoCantidad(params.folios, params.Monto);
    }
    this._dialogRef.close({ accion: true, data: params });
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

}

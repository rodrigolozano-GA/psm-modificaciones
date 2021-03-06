import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { finalize } from 'rxjs/operators';

export class Sucursal {
  id: number;
  numero: string;
  nombre: string;
  direccion: string;
  lat: string;
  long: string;
  inventario: Inventario[];

  constructor() { }
}

export interface Inventario {
  id: number;
  clave: string;
  cantidad: number;
  nombre: string;
  tipo: string;
  caracteristicas: Caracteristica[]
}

export interface Caracteristica {
  titulo: string;
  valor: string;
}

@Component({
  selector: 'app-dialogo-sucursal',
  templateUrl: './dialogo-sucursal.component.html',
  styleUrls: ['./dialogo-sucursal.component.scss']
})
export class DialogoSucursalComponent implements OnInit {
  nombre: string = "";

  lat: number = 20.653805;
  lng: number = -103.347631;

  latMark: number = null;
  lngMark: number = null;

  generalForm: FormGroup;
  sucursal: Sucursal = new Sucursal();

  tipoEquipos = [
    { id: 1, nombre: "Nombre del tipo de equipo" },
    { id: 2, nombre: "Nombre del tipo de equipo" },
    { id: 3, nombre: "Nombre del tipo de equipo" },
    { id: 4, nombre: "Nombre del tipo de equipo" },
    { id: 5, nombre: "Nombre del tipo de equipo" },
    { id: 6, nombre: "Nombre del tipo de equipo" },
    { id: 7, nombre: "Nombre del tipo de equipo" },
  ]

  caracteristicasList = [
    { titulo: "Color", valor: "Verde" },
    { titulo: "Tamaño", valor: "4x" },
    { titulo: "Color", valor: "Verde" },
    { titulo: "Tamaño", valor: "4x" },
    { titulo: "Color", valor: "Verde" },
    { titulo: "Tamaño", valor: "4x" }
  ]

  inventarioList: [] = [];

  datosSucursal: any = {};

  overlayRef: OverlayRef;

  constructor(
    private _fb: FormBuilder,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.datosSucursal = this.data.data;
    }

  ngOnInit() {

    this.generalForm = this._fb.group({
      numero: [{ value: this.sucursal.numero, disabled: true }],
      nombre: [{ value: this.sucursal.nombre, disabled: true }],
      direccion: [{ value: this.sucursal.direccion, disabled: true }],
      lat: [this.sucursal.lat],
      long: [this.sucursal.long],
      inventario: [this.sucursal.inventario]
    })

    this.estatusChanges();
    this.cargaDatos();

  }

  estatusChanges = () => {
    this.generalForm.get("inventario").valueChanges.subscribe(reg => {
      //console.log('lista antes', this.inventarioList)
      this.inventarioList = reg;
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

  ObtenerCombos(url: string, params: any = null, tipo = 0) {
    this.mostrarCarga();
    this._dataService.postData<any>(url, "", params)
      .pipe(finalize(() => { if (this.overlayRef != undefined) { this.overlayRef.detach(); } }))
      .subscribe(
        data => {
          //console.log("datos: ", data["DATA"]);
          if(data["SUCCESS"]) {
            switch(tipo) {
              case 1:
                if(data["DATA"].length > 0) {
                  let response = data["DATA"][0];
                  this.nombre = response.no_economico + " - " + response.tienda;
                  this.generalForm.patchValue({ numero: response.no_economico, nombre: response.tienda, direccion: response.direccion });
                  this.latMark = response.latitud;
                  this.lngMark = response.longitud;

                  if(response.latitud || response.longitud) {
                    this.lat = response.latitud;
                    this.lng = response.longitud;
                  }
                }
                break;
              case 2:
                this.generalForm.patchValue({ inventario: data["DATA"] });
                break;
            }
          }
        },
        error => {
          this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        }
      );
  }

  cargaDatos = () => {
    // Datos generales
    let params: any = { id: this.datosSucursal.sucursal_id };
    this.ObtenerCombos('mesaControl/seguimiento/sucursalFolio/detalle', params, 1);

    // Inventario
    //this.ObtenerCombos('', params, 2);

    //console.log(this.generalForm.value);
    //console.log(this.inventarioList);
  }

}

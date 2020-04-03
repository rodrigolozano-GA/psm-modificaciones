import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Sucursal } from '../../mesa-control/dialogo-sucursal/dialogo-sucursal.component';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { finalize } from 'rxjs/operators';

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

    /*let inventarios = [
      { id: 1, clave: "XOMCLAVE02", cantidad: 9949, nombre: "Nombre del equipo en invetario 1", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
      { id: 2, clave: "XOMCLAVE01", cantidad: 9969, nombre: "Nombre del equipo en invetario2", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
      { id: 3, clave: "XOMCLAVE03", cantidad: 9979, nombre: "Nombre del equipo en invetario3", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
      { id: 4, clave: "XOMCLAVE01", cantidad: 9919, nombre: "Nombre del equipo en invetario4", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
      { id: 5, clave: "XOMCLAVE05", cantidad: 9929, nombre: "Nombre del equipo en invetario5", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
      { id: 6, clave: "XOMCLAVE01", cantidad: 9999, nombre: "Nombre del equipo en invetario6", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
      { id: 7, clave: "XOMCLAVE06", cantidad: 9939, nombre: "Nombre del equipo en invetario7", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
      { id: 8, clave: "XOMCLAVE01", cantidad: 9999, nombre: "Nombre del equipo en invetario8", tipo: "Nombre del tipo del equipo", caracteristicas: this.caracteristicasList },
    ]*/

    //console.log(this.generalForm.value);
    //console.log(this.inventarioList);
  }

}

import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatDialog, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { formatDate } from '@angular/common';
import { DialogoMotivosComponent } from '../dialogo-motivos/dialogo-motivos.component';
import { DialogoSucursalComponent } from '../dialogo-sucursal/dialogo-sucursal.component';

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

@Component({
  selector: 'app-dialogo-folio',
  templateUrl: './dialogo-folio.component.html',
  styleUrls: ['./dialogo-folio.component.scss']
})
export class DialogoFolioComponent implements OnInit {

  estatusList = [
    { id: 1, nombre: "Cancelado " },
    { id: 2, nombre: "Nombre estatus 2" },
    { id: 3, nombre: "Nombre estatus 3" },
    { id: 4, nombre: "Nombre estatus 4" },
    { id: 5, nombre: "Nombre estatus 5" },
    { id: 6, nombre: "Nombre estatus 6" },
    { id: 7, nombre: "Nombre estatus 7" }
  ]

  clientesList = [
    { id: 1, nombre: "Nombre cliente 1" },
    { id: 2, nombre: "Nombre cliente 2" },
    { id: 3, nombre: "Nombre cliente 3" },
    { id: 4, nombre: "Nombre cliente 4" },
    { id: 5, nombre: "Nombre cliente 5" },
    { id: 6, nombre: "Nombre cliente 6" },
    { id: 7, nombre: "Nombre cliente 7" }
  ]

  sucursalesList = [
    { id: 1, nombre: "Nombre sucursal 1" },
    { id: 2, nombre: "Nombre sucursal 2" },
    { id: 3, nombre: "Nombre sucursal 3" },
    { id: 4, nombre: "Nombre sucursal 4" },
    { id: 5, nombre: "Nombre sucursal 5" },
    { id: 6, nombre: "Nombre sucursal 6" },
    { id: 7, nombre: "Nombre sucursal 7" }
  ]

  serviciosList = [
    { id: 1, nombre: "Nombre servicio 1" },
    { id: 2, nombre: "Nombre servicio 2" },
    { id: 3, nombre: "Nombre servicio 3" },
    { id: 4, nombre: "Nombre servicio 4" },
    { id: 5, nombre: "Nombre servicio 5" },
    { id: 6, nombre: "Nombre servicio 6" },
    { id: 7, nombre: "Nombre servicio 7" }
  ]

  mediosList = [
    { id: 1, nombre: "Nombre medio 1" },
    { id: 2, nombre: "Nombre medio 2" },
    { id: 3, nombre: "Nombre medio 3" },
    { id: 4, nombre: "Nombre medio 4" },
    { id: 5, nombre: "Nombre medio 5" },
    { id: 6, nombre: "Nombre medio 6" },
    { id: 7, nombre: "Nombre medio 7" }
  ]

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

  displayedColumnsServ: string[] = ['codigo', 'nombre', 'cantidad', 'costo', 'importe'];
  dataSourceServ = new MatTableDataSource(this.SERV_DATA);
  selectionServ = new SelectionModel<Servicios>(true, [])
  constructor(private _dialog: MatDialog, public _dialogRef: MatDialogRef<DialogoFolioComponent>) { }
  fileName: string = "";
  hoy: string = formatDate(Date.now(), "yyMMddHHmmssSSS", "en-US");
  estatus: number = 0;

  ngOnInit() {
  }

  guardarFolio = () => {
    if (this.estatus != 1) {
      this._dialogRef.close(true);
      return;
    }

    const dialogRef = this._dialog.open(DialogoMotivosComponent, {
      panelClass: 'dialog-motivos'
    })

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this._dialogRef.close();
      }
    })
  }

  dialogoSucursal = () => {
    const dialogRef = this._dialog.open(DialogoSucursalComponent, {
      panelClass: 'dialog-sucursal'
    })

    dialogRef.afterClosed().subscribe(res => {
    })
  }

}

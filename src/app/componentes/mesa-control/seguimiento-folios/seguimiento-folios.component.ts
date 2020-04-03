import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';

import { ExcelService } from '../../../servicios/excel/excel.service';

import { Folio } from '../../../clases/MesaControl/Folio';

import { DialogoFolioComponent } from '../dialogo-folio/dialogo-folio.component';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { DialogoImportadorComponent } from '../dialogo-importador/dialogo-importador.component';

@Component({
  selector: 'app-seguimiento-folios',
  templateUrl: './seguimiento-folios.component.html',
  styleUrls: ['./seguimiento-folios.component.scss']
})
export class SeguimientoFoliosComponent implements OnInit {

  ELEMENT_DATA: any[] = [/*
    { id: 1, numero: 1, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },
    { id: 2, numero: 2, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },
    { id: 3, numero: 3, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },
    { id: 4, numero: 4, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },
    { id: 5, numero: 5, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },
    { id: 6, numero: 6, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },
    { id: 7, numero: 7, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },
    { id: 8, numero: 8, folio: "19070405305544", sucursal: "Nombre de la sucursal", cliente: "Nombre del cliente", tiposervicio_id: 1, tiposervicio: "Mantenimiento Correctivo", archivo: "", cliente_id: 1, coodinador: "nombre del coordinador", coodinador_id: 1, descripcion: "Descripción", fecha_programada: "", medio: "medio", medio_id: 1, observaciones: "observaciones", servicios: [], sucursal_id: 1, tipoequipo: "tipo quipo", tipoequipo_id: 2 },*/
  ];

  displayedColumns: string[] = ['numero', 'folio', 'cliente', 'tiposervicio', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Folio>(false, [])
  constructor(
    private _dialog: MatDialog, 
    private _excelService: ExcelService, 
    private _dataService: GeneralService,
    private _snack: MatSnackBar) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    
    this.ActualizarTabla();
  }

  busqueda = (filtro: string) => {
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  dialogoVerFolio = (row: any) => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-folio',
      data: { accion: 1, data: row }
    })

    _dialogRef.beforeClosed().subscribe(res => {
      this.ActualizarTabla();
    })
  }

  exportAsExcel = () => {
    this._excelService.exportAsExcelFile(this.dataSource.filteredData, "Folios");
  }

  importExcel = () => {
    const _dialogRef = this._dialog.open(DialogoImportadorComponent, {
    
      data: {name:"Hola"}
    });
  }

  ActualizarTabla = () => {
    this._dataService.postData<Folio[]>("mesaControl/seguimiento/all", "").subscribe(
      data => {
        this.ELEMENT_DATA = data["DATA"];
        this.dataSource.data = this.ELEMENT_DATA;
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

}

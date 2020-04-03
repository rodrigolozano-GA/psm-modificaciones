import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar, MatDialog } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Folio } from '../../../clases/MesaControl/Folio';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { DialogoReportarComponent } from '../dialogo-reportar/dialogo-reportar.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
@Component({
  selector: 'app-seguimiento-servicio',
  templateUrl: './seguimiento-servicio.component.html',
  styleUrls: ['./seguimiento-servicio.component.scss']
})
export class SeguimientoServicioComponent implements OnInit {

  ELEMENT_DATA: any[] = [];

  displayedColumns: string[] = ['select','numero', 'folio', 'cliente', 'tiposervicio','estatus', 'actions'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Folio>(true, [])
  
  overlayRef: OverlayRef;

  constructor( 
    private _dialog: MatDialog,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay,) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.ActualizarTabla();
  }

  busqueda = (filtro: string) => {
    this.dataSource.filter = filtro.trim().toLowerCase();
  }

  dialogoReportar = () => {
    const dialogRef = this._dialog.open(DialogoReportarComponent, {
      panelClass: 'dialog-reportar',
      data: { folios: this.selection.selected }
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.ActualizarTabla();
      }
    });
  }

  dialogoVerFolio = (row: any) => {
    const _dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-folio',
      data: { accion: 1, data: row }
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

  ActualizarTabla = () => {
    this.mostrarCarga();
    this._dataService.postData<Folio[]>("administracion/seguimientoFolios/all", "").subscribe(
      data => {
        this.overlayRef.detach();
        this.ELEMENT_DATA = data["DATA"];
        this.dataSource.data = (this.ELEMENT_DATA.filter(item => item.estatus="Realizado"));
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
    console.log("Actualizando..");
  }
  
}

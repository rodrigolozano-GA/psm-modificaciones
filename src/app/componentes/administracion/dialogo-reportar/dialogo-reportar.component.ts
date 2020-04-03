import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { finalize } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface Folio {
  id: number;
  folio: string;
  sucursal_id: number;
  sucursal: string;
  cliente_id: number;
  cliente: string;
}

@Component({
  selector: 'app-dialogo-reportar',
  templateUrl: './dialogo-reportar.component.html',
  styleUrls: ['./dialogo-reportar.component.scss']
})
export class DialogoReportarComponent implements OnInit {
  listaFolios: Folio[] = [];
  displayedColumns: string[] = ['folio', 'cliente'];
  dataSource = new MatTableDataSource(this.listaFolios);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Folio>(true, []);

  generalForm: FormGroup;

  // Loader
  overlayRef: OverlayRef;

  sessionData: any;

  constructor(
    private _dialog: MatDialog, 
    public _dialogRef: MatDialogRef<DialogoReportarComponent>,
    private _snack: MatSnackBar,
    private _excelService: ExcelService,
    private _dataService: GeneralService,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.dataSource.data = this.data.folios;
    this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
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

  reportar = () => {
    const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
      panelClass: 'dialog-confirmaciones',
      data: { title: "Reportar Gastos", text: `¿Está seguro de Reportar los Folios Seleccionados?`, cancelAction: "NO REPORTAR", okAction: "REPORTAR" }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.mostrarCarga();
        // Mensaje de respuesta
        let varmsg = "";
        
        // Contar numero total de elementos de la lista
        let contItemTtl = 0;
        // Contar los registros que se guardaron con exito
        let contItem = 0;
        let tipoError = true; // validar tipo de mensaje a mostrar

        let params: any = {};
        this.dataSource.data.forEach(item => {
          contItemTtl++;
          params.id = item.id;
          params.usuario_id = this.sessionData.IdUsuario;
          //console.log("envio de folios: ", params);
          this._dataService.postData<any[]>("administracion/seguimientoFolios/reportar/save", "", params)
          .pipe(
            finalize(()=> {
              if(contItemTtl == this.dataSource.data.length) {
                this.overlayRef.detach();
                if(contItem != contItemTtl && contItem != 0) {
                  varmsg = "Algunos Folios no se reporaron";
                  tipoError = true;
                }
                if(contItem == 0) {
                  tipoError = false;
                }
                this._snack.open(varmsg, "", { duration: 8000, panelClass: [tipoError ? "snack-ok" : "snack-error"] });
                if(contItem != 0) {
                  this._dialogRef.close(true);
                }
              }
            })
          )
          .subscribe(
            data => { if(data["SUCCESS"]) { contItem++; } varmsg = data["MESSAGE"]; }, error => { contItem = contItem; varmsg = "Error al conectar con el servidor"; }
          );
        });
      }
    })
  }

}

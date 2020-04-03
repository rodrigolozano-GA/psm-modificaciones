import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { pipe } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface Acta {
  id: number;
  numero: number;
  folio: string;
  sucursal: string;
  sucursal_numero: number;
  sucursal_id: number;
  cliente: string;
  cliente_id: number;
}

@Component({
  selector: 'app-dialogo-envio',
  templateUrl: './dialogo-envio.component.html',
  styleUrls: ['./dialogo-envio.component.scss']
})
export class DialogoEnvioComponent implements OnInit {

  dataActas: Acta[] = [];

  displayedColumns: string[] = ['numero', 'folio', 'sucursal'];
  dataSource = new MatTableDataSource([]);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  selection = new SelectionModel<Acta>(true, []);

  // Loader
  overlayRef: OverlayRef;

  sessionData: any;

  constructor(private _dialog: MatDialog,
    private _snack: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogoEnvioComponent>,
    private _dataService: GeneralService,
    private _overlay: Overlay) {
      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct'))
      this.dataSource.data = this.data.actas;
  }

  ngOnInit() {
    this.dataSource.sort = this.sort;
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

  enviar = () => {
    const dialogRef = this._dialog.open(DialogoConfirmacionesComponent, {
      panelClass: 'dialog-confirmaciones',
      data: { title: "Envío de Actas", text: `¿Está seguro de enviar las actas seleccionadas?`, cancelAction: "NO ENVIAR", okAction: "ENVIAR" }
    })
    //return this.dialogRef.close(true);
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let params: any = { 
          usuario_id: this.sessionData.IdUsuario, 
          folio_id: 0 };

        // Mensaje de respuesta
        let varmsg = "";

        let contActasTtl = 0; // total a enviar
        let contActas = 0; // enviadas con éxito

        let tipoError = true;

        this.mostrarCarga();
        // Enviar Actas
        this.dataSource.data.forEach(item => {
          params.acta_id = item.id_acta;
          params.usuario_id = this.sessionData.IdUsuario;
          this._dataService.postData<any[]>("operaciones/armadoActas/enviar", "", params)
          .pipe( finalize (() => {
            //console.log("envio de actas: ", params);
            contActasTtl++;
            if(contActasTtl == this.dataSource.data.length) {
              this.overlayRef.detach();
              if(contActas != contActasTtl && contActas != 0) {
                varmsg = "Algunas Actas no se enviaron";
                tipoError = true;
              }
              if(contActas == 0) {
                tipoError = false;
              }
              this._snack.open(varmsg, "", { duration: 8000, panelClass: [tipoError ? "snack-ok" : "snack-error"] });
              
              if(contActas != 0) {
                this.dialogRef.close(true);
              }
            }
          }))
          .subscribe(
            data => { if(data["SUCCESS"]) { contActas++; params.folio_id = data["ID"]; } varmsg = data["MESSAGE"]; }, error => { contActas = contActas; varmsg = "Error al conectar con el servidor"; }
          );
        });
      }
    })
  }

}

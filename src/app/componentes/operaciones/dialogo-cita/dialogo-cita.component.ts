import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OverlayConfig, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-dialogo-cita',
  templateUrl: './dialogo-cita.component.html',
  styleUrls: ['./dialogo-cita.component.scss']
})
export class DialogoCitaComponent implements OnInit {

  datosFolio: any = {};

  generalForm: FormGroup;

  overlayRef: OverlayRef;

  fechaData: string = "";

  constructor(
    private _dialogRef: MatDialogRef<DialogoCitaComponent>,     
    private _fb: FormBuilder,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) {
    this.datosFolio = this.data.data;
    let temfecha = this.datosFolio.fecha_programada;
    this.fechaData = temfecha ? temfecha.split('/')[1]+'-'+temfecha.split('/')[0]+'-'+temfecha.split('/')[2] : null;
  }

  ngOnInit() {
    this.generalForm = this._fb.group({
      fecha: [new Date(this.fechaData)]
    })

    //console.log(this.generalForm.get("fecha").value);
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

  actualizaFechaFolio = () => {
    let params: any = {};
    params.id = this.datosFolio.id;
    params.fecha_programada = this.generalForm.value.fecha;
    params.fecha_programada_value = formatDate(this.generalForm.value.fecha, "yyyy/MM/dd", "en-US");
    params.ot = this.datosFolio.ot;
    params.ticket = this.datosFolio.ticket;
    params.estatus = this.datosFolio.estatus_id;
    //console.log("save infoGenral: ", params);
    if(this.generalForm.value.fecha == null || this.generalForm.value.fecha == ""){
      return this._snack.open("La fecha programada no es válida", "", { duration: 2000, panelClass: ["snack-error"] });
    }
    this.mostrarCarga();
    this.ActionPost(params, 'mesaControl/seguimiento/infoGeneralFolio/save');
  }

  ActionPost = (item: any, url: string) => {
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        //console.log("save detalle folio: ", data);
        this.overlayRef.detach();
        
        this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
        if(data["SUCCESS"]) {
          this._dialogRef.close();
        }
      }, error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

}

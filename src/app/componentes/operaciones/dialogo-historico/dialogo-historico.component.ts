import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Mensaje } from '../../../clases/Operaciones/Mensaje';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayComponent } from '../../overlay/overlay.component';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({
  selector: 'app-dialogo-historico',
  templateUrl: './dialogo-historico.component.html',
  styleUrls: ['./dialogo-historico.component.scss']
})
export class DialogoHistoricoComponent implements OnInit {

  actualizacionData: Mensaje[] = [];

  generalForm: FormGroup;
  historicoForm: FormGroup;

  overlayRef: OverlayRef;

  datosFolio: any = {};

  constructor(
    public dialogRef: MatDialogRef<DialogoHistoricoComponent>,
    private _fb: FormBuilder, 
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.datosFolio = this.data.data;
    //console.log("previo: ", this.datosFolio);
  }

  chatColumns: string[] = ['mensaje'];
  dataActl = new MatTableDataSource(this.actualizacionData);
  @ViewChild('tableActl', { static: true }) sortActl: MatSort;
  @ViewChild('ActlPaginator', { static: true }) paginatorActl: MatPaginator;

  ngOnInit() {
    this.dataActl.sort = this.sortActl;
    this.dataActl.paginator = this.paginatorActl;

    this.generalForm = this._fb.group({
      actualizacion: ["", [Validators.required]]
    })

    this.historicoForm = this._fb.group({
      listaHistorico: [[]]
    })

    this.estatusChange();
    this.cargaDatos();

  }

  estatusChange = () => {
    this.historicoForm.get("listaHistorico").valueChanges.subscribe(reg => {
      this.dataActl.data = reg;
    })
  }

  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
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

  cargaDatos = () => {
    this.mostrarCarga();
    let params: any = { id: this.datosFolio.id };
    this.ObtenerDatos('mesaControl/seguimiento/actulizacion/obtActualizaciones', params);
  }

  ObtenerDatos = (url: string, params: any = null) => {
    this._dataService.postData<any[]>(url, "", params).subscribe(
      data => {
        this.overlayRef.detach(); this.dataActl.data = data["DATA"];
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); 
        this.overlayRef.detach();
      }
    );
  }

  actualizar = () => {
    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      return;
    }
    let params: any = {};
    params.id = this.datosFolio.id;
    params.descripcion = this.generalForm.value.actualizacion;
    this.mostrarCarga();
    this.ActionPost(params, 'mesaControl/seguimiento/actulizacion/save');
  }

  ActionPost = (item: any, url: string) => {
    this._dataService.postData<any>(url, "", item).subscribe(
      data => {
        //console.log("save detalle folio: ", data);
        this.overlayRef.detach();

        this._snack.open(data["MESSAGE"], "", { duration: 2000, panelClass: [data["SUCCESS"] ? "snack-ok" : "snack-error"] });
        
        if(data["SUCCESS"]) {
          this.generalForm.reset();
          this.generalForm.clearValidators();
          this.cargaDatos();
        }
      }, error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }

}

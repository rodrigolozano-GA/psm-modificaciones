import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatPaginator, MatSort } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Servicio } from 'src/app/clases/cotizaciones/Servicio';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

@Component({
  selector: 'app-dialogo-seleccion-servicios',
  templateUrl: './dialogo-seleccion-servicios.component.html',
  styleUrls: ['./dialogo-seleccion-servicios.component.scss']
})
export class DialogoSeleccionServiciosComponent implements OnInit {

  listaServicios: Servicio[] = [];

  generalForm: FormGroup;

  overlayRef: OverlayRef;

  displayedColumnsServ: string[] = ['check','codigo', 'concepto', 'actions'];
  dataSourceServ = new MatTableDataSource(this.listaServicios);
  selectionServ = new SelectionModel<Servicios>(true, [])
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  datosFolio: any = {};

  constructor(
    public _dialogRef: MatDialogRef<DialogoSeleccionServiciosComponent>, 
    private _fb: FormBuilder, private _snack: MatSnackBar,
    private _dataService: GeneralService,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.datosFolio = this.data.data;
    }

  ngOnInit() {
    this.dataSourceServ.sort = this.sort;
    this.dataSourceServ.paginator = this.paginator;

    this.generalForm = this._fb.group({
      servicios: [this.listaServicios]
    })

    this.changesDetect();
    this.mostrarCarga();
    this.ObtenerDatos('mesaControl/obtener/cliente/servicios');
  }

  busqueda = (filtro: string) => {
    this.dataSourceServ.filter = filtro.trim().toLowerCase();
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

  registrar = () => {
    let bEnviar: boolean = true;
    if (this.selectionServ.isEmpty()) {

      this._snack.open("No se han seleccionado productos", '', {
        duration: 2000,
        panelClass: 'snack-error'
      });

      return;
    }

    let regex = /^0*[1-9][0-9]*([0-9]+)?$/;

    ///verificar que no tengan campo de cantidad vacio
    this.generalForm.get("servicios").value.map(reg => {
      if (!reg.cantidad || !regex.test(reg.cantidad)) {
        bEnviar = false;
        this.generalForm.markAllAsTouched();
        this._snack.open("Ingrese la cantidad de los productos seleccionados", '', {
          duration: 2000,
          panelClass: 'snack-error'
        });

        return;
      }
    });

    if (bEnviar) {
      let resLista: any = [];
      resLista = this.generalForm.get("servicios").value;
      resLista.forEach(item => { item.nuevo = 1; });
      this._dialogRef.close(resLista);
    }
  }

  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  changesDetect = () => {
    this.selectionServ.changed.subscribe((sub) => {
      this.generalForm.patchValue({ servicios: sub.source.selected });
    })

    this.generalForm.get("servicios").valueChanges.subscribe((reg) => {
      console.log("subscribidos:", reg);
    })
  }

  ObtenerDatos = (uri:string) => {
    let param: any = { cliente_id: this.datosFolio.cliente_id };
    let url = uri;
    this._dataService.postData<any>(url, "", param).subscribe(
      data => {
        this.dataSourceServ.data = data.DATA; this.overlayRef.detach();
        if(this.datosFolio.hasOwnProperty("url")) {
          this.dataSourceServ.data.forEach(item => {
            item.cantidad = parseInt(item.cantidad+"");
          });
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
  }
}

export interface Servicios {
  id: number;
  nombre: string;
  codigo: string;
  cantidad: number;
  costo: number;
}

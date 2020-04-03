import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MAT_DIALOG_DATA, MatSnackBar, MatDialogRef, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { Servicio } from 'src/app/clases/cotizaciones/Servicio';
import { FormGroup, FormBuilder } from '@angular/forms';
import { GeneralService } from '../../../servicios/general/general.service';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';


@Component({
  selector: 'app-dialogo-productos',
  templateUrl: './dialogo-productos.component.html',
  styleUrls: ['./dialogo-productos.component.scss']
})
export class DialogoProductosComponent implements OnInit {

  overlayRef: OverlayRef;
  generalForm: FormGroup;
  servicio: Servicio = new Servicio();

  listaServicios: Servicio[] = [
    /*{ id: 1, codigo: "1", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", precio: 50 },
    { id: 1, codigo: "2", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", precio: 60 },
    { id: 1, codigo: "3", concepto: "Cerradura digital con retardo de 1 a 99 minutos marca  la gard mod 39-E (completa)", precio: 30 }*/
  ];

  displayedColumnsServ: string[] = ['check', 'concepto', 'actions'];
  dataSourceServ = new MatTableDataSource<Servicio>(this.listaServicios);
  selectionServ = new SelectionModel<Servicio>(true, []);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  datosGasto: any = {};

  constructor(
    public _dialogRef: MatDialogRef<DialogoProductosComponent>,
    private _fb: FormBuilder, 
    private _snack: MatSnackBar,
    private _dataService: GeneralService,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.datosGasto = this.data.datosEmpleado;
    let sesion = JSON.parse(localStorage['SessionConAct']);
    
    }

  ngOnInit() {
    this.dataSourceServ.sort = this.sort;
    this.dataSourceServ.paginator = this.paginator;

    this.generalForm = this._fb.group({
      servicios: [this.listaServicios],
    })

    this.changesDetect();
    this.ObtenerDatos();
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
      this._dialogRef.close(this.generalForm.get("servicios").value);
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
    //  console.log("subscribidos:", reg);
    })
  }

  ObtenerDatos = () => {
    this.mostrarCarga();
    let param: any = { id: this.datosGasto.nempleado };
    this._dataService.postData<any>('gastos/empleado/productos', "", param).subscribe(
      data => {
       // console.log('Servicio : ', 'gastos/empleado/productos', "", param)
        this.overlayRef.detach();
        this.dataSourceServ.data = data.DATA;
      },
      error => {
        this.overlayRef.detach();
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

}

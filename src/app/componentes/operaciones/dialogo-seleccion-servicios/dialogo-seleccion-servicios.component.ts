import { Component, OnInit, Inject, ViewChild, ɵConsole } from '@angular/core';
import { MatTableDataSource, MatSnackBar, MatSort, MatPaginator } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Servicio } from 'src/app/clases/cotizaciones/Servicio';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export interface Servicios {
  id: number;
  nombre: string;
  checked: number;
}

@Component({
  selector: 'app-dialogo-seleccion-servicios',
  templateUrl: './dialogo-seleccion-servicios.component.html',
  styleUrls: ['./dialogo-seleccion-servicios.component.scss']
})

export class DialogoSeleccionServiciosComponent implements OnInit {

  listaServicios: Servicio[] = [];
  
  mapaCantidades: any;
  generalForm: FormGroup;

  overlayRef: OverlayRef;

  displayedColumnsServ: string[] = ['check', 'concepto', 'actions'];
  dataSourceServ = new MatTableDataSource(this.listaServicios);
  selectionServ = new SelectionModel<Servicios>(true, []);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  datosFolio: any = {};

  cantidad:any = 0;

  constructor(
    public _dialogRef: MatDialogRef<DialogoSeleccionServiciosComponent>, 
    private _fb: FormBuilder, private _snack: MatSnackBar,
    private _dataService: GeneralService,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.datosFolio = this.data.data;
      console.log("REfaccion : " , this.datosFolio)
    }

  ngOnInit() {
    this.ObtenerDatos();
    this.dataSourceServ.sort = this.sort;
    this.dataSourceServ.paginator = this.paginator;
    
    this.generalForm = this._fb.group({
      servicios: [this.listaServicios]
    })

    this.changesDetect();
    this.mostrarCarga();
    //this.ObtenerDatos();
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
    let exce = false;
    let negativo = false;
    let cadenaError ="";
   
    ///verificar que no tengan campo de cantidad vacio
    this.generalForm.get("servicios").value.map(reg => {/*
      JSON.parse(localStorage.getItem('cantidades')).forEach(function(value){
        if(reg.id == value.id)
        {
          if(reg.cantidad > value.cantidad)
          {
            bEnviar = false;
            exce=true;
            cadenaError = "Exceso en la cantidad con la disponibilidad.";

          }
          if(reg.cantidad < 0)
          {
            bEnviar = false;
            negativo = true;
            cadenaError = "La cantidad no puede ser un número negativo.";
          }
        }
      });
      if(exce || negativo)
      {
        
          this._snack.open(cadenaError, '', {
            duration: 2000,
            panelClass: 'snack-error'
          });
    
          return;
      }
*/
      if (!reg.cantidad || !regex.test(reg.cantidad)) {
        //console.log("Este registro necesita cantidad", reg);
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
      //this._dialogRef.close(this.generalForm.get("servicios").value);
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

  ObtenerDatos = () => {

    this.mapaCantidades = new Map();
    let arrayDatos: any = [];
    let param: any = { cliente_id: this.datosFolio.cliente_id };
    let url = 'mesaControl/obtener/cliente/servicios';
    //this.datosFolio.hasOwnProperty("url") ? this.datosFolio.url : 'mesaControl/obtener/cliente/servicios';
    
    this._dataService.postData<any>(url, "", param).subscribe(
      data => {
        this.dataSourceServ.data = data.DATA;
        this.overlayRef.detach();
        if(this.datosFolio.hasOwnProperty("url")) {
          this.dataSourceServ.data.forEach(item => {
            item.cantidad = parseInt(item.cantidad+"");
            this.mapaCantidades.set(item.id,item.cantidad);
          });
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] }); this.overlayRef.detach();
      }
    );
    /*
    arrayDatos = localStorage.getItem('cantidades');
    let obt = JSON.parse(arrayDatos);
    console.log('DATOS: ' ,  (this.dataSourceServ.data));
    console.log('OBT: ', obt);
    this.mapaCantidades = new Map(obt.map(i => [i.id, i.cantidad]));
    */
  }

}

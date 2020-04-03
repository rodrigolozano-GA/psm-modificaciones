import { Component, OnInit, Inject } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-dialogo-gasto-conceptos',
  templateUrl: './dialogo-gasto-conceptos.component.html',
  styleUrls: ['./dialogo-gasto-conceptos.component.scss']
})
export class DialogoGastoConceptosComponent implements OnInit {
  listaDetalle = [];
  mensageLista: string = "";
  id: number = 0;
  constructor(
    private _snack: MatSnackBar, 
    private _dataService: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.id = this.data.id;
    }

  ngOnInit() {
    this.ObtenerDatos();
  }

  ObtenerDatos = () => {
    let params: any = { opc: 2, id: this.id };
    this._dataService.postData<any[]>("catalogos/gastosDetalle/all", "", params).subscribe(
      data => {
        this.mensageLista = this.listaDetalle.length ? "" : "No hay registros disponibles";
        this.listaDetalle = data["DATA"];
      },
      error => {
        this.mensageLista = "";
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

}

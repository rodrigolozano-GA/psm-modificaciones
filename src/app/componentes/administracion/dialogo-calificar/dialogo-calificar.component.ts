import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { DialogoMotivosComponent } from '../dialogo-motivos/dialogo-motivos.component';
import { DialogoConfirmacionesComponent } from '../../dialogo-confirmaciones/dialogo-confirmaciones.component';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import * as pdfGeneral from './../../../funciones/funcionesG';
import { finalize } from 'rxjs/operators';

export interface Advertencias {
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-dialogo-calificar',
  templateUrl: './dialogo-calificar.component.html',
  styleUrls: ['./dialogo-calificar.component.scss']
})
export class DialogoCalificarComponent implements OnInit {

  estatusList = [
    /*{ id: 1, nombre: "APROBADA" },
    { id: 2, nombre: "NO APROBADA" },*/
  ]

  adverList: any[] = [
    /*{ id: 1, nombre: "Nombre de la advertencia por motivos motivos motivos motivos" },*/
  ];

  // Guardar la lista de advertencias por cada Acta
  resultLista = [];

  estatus: boolean;
  estatusNombre: string = "";

  generalForm: FormGroup;

  overlayRef: OverlayRef;

  datosSolicitud: any = {}; 

  sessionData: any;

  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  constructor(private _fb: FormBuilder,
    private _snack: MatSnackBar,
    private _dataService: GeneralService,
    public dialogRef: MatDialogRef<DialogoCalificarComponent>,
    private _dialog: MatDialog,
    private _overlay: Overlay,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.datosSolicitud = this.data.data;
      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
      //console.log("califica: ", this.datosSolicitud);
  }

  ngOnInit() {
    this.generalForm = this._fb.group({
      id: [''],
      estatus: [this.estatus, [Validators.required]]
    })

    this.cargarDatos();
  }

  guardar () {

    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      return;
    }
    switch (this.estatusNombre.toLowerCase()) {
      case "aprobado": // generar pdf
        this.dialogoAprobado();
        break;
      case "no aprobado":
        this.dialogoMotivos();
        break;
      default:
        break;
    }
  }

  dialogoAprobado = () => {
    const dRef = this._dialog.open(DialogoConfirmacionesComponent, {
      panelClass: 'dialog-confirmaciones',
      data: { title: "Autorizar Solicitud", text: `¿Está seguro de Autorizar la solicitud?`, cancelAction: "NO AUTORIZAR", okAction: "AUTORIZAR" }
    })

    dRef.afterClosed().subscribe(res => {
      if (res) {
        this.mostrarCarga();
        this.ActionPost(false, true);
      }
    })
  }

  dialogoMotivos = () => {
    //this.datosSolicitud.estatus_id = this.generalForm.value.estatus;
    const dialogRef = this._dialog.open(DialogoMotivosComponent, {
      panelClass: 'dialog-motivos',
      data: { data: this.datosSolicitud, estatus_id: this.generalForm.value.estatus }
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res.btn) {
        this.mostrarCarga();
        //this.ActionPost(params, 'administracion/aprobarSolicitud/save', 0, res.msg);
        this.ActionPost(true, false);
      }
    })
  }

  cargarDatos = () => {
    let params: any = {};
    params.opc = 15;
    this.ObtenerCombos('catalogos/estatus/combo', 1, params);

    this.generalForm.patchValue({
      id: this.data.data.id,
      estatus: this.data.data.estatus
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

  obtAdvertencias = () => {
    let listaActas = [];
    this.datosSolicitud.forEach(item => {
      if(!listaActas.includes(item.formato_id)) {
        listaActas.push(item.formato_id);
      }
    });
    listaActas = [...new Set(listaActas)];
    //console.log("listaActas: ", listaActas);
    listaActas.forEach(item => {
      let params: any = { id: item, estatus: this.generalForm.value.estatus };
      //console.log("params: ", params);
      this.ObtenerCombos('administracion/advertencias/all', 2, params);
    });
  };

  // Consumir servicio para obtener info de inputs, selects, listas, tablas
  ObtenerCombos(url: string, tipo = 0, params: any = null) {
    this._dataService.postData<any>(url, "", params).subscribe(
      data => {
        switch(tipo) {
          case 1: this.estatusList = data.DATA; break;
          case 2: 
            this.adverList = data.DATA;
            this.resultLista = [];
            if(this.adverList.length) {
              if(this.adverList[0].MESSAGE != "") {
                this.resultLista = this.adverList[0].MESSAGE.split("|");
              }
            }
            this.adverList = this.resultLista;
            break;
        }
      },
      error => {
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

  ActionPost = (abrirMotivo = false, abrirPdf = false, respuestaMotivo = "") => {
    let params: any = {};
    let datosPDF: any = {};
    /*datosPDF.ticket = "";
    datosPDF.nombreEmpleado = this.datosSolicitud[0].tecnico;
    datosPDF.lstSolicitudes = this.datosSolicitud;
    pdfGeneral.pdfAcuseActas(datosPDF);
    this.overlayRef.detach();
    return false;*/
    //this.mostrarCarga();
    let contItemsTtl = 0;
    let contItems = 0;
    let msg = "";
    
    this.datosSolicitud.forEach(element => {
      params.id = element.id;
      params.estatus = this.generalForm.value.estatus;
      params.usuario_id = this.sessionData.IdUsuario;
      params.ticket = "";

      this._dataService.postData<any>('administracion/aprobarSolicitud/save', "", params)
      .pipe(finalize(()=> {
        contItemsTtl++;
        if(contItemsTtl == this.datosSolicitud.length) {
          let tipoAlert = true;
          if(contItems != this.datosSolicitud.length && contItems != 0) {
            msg = "Algunas Solicitudes no se guardaron correctamente";
          }

          if(contItems == 0) {
            tipoAlert = false;
            msg = "Error al guardar las Solicitudes";
          }

          if(abrirPdf && contItems != 0) {
            //datosPDF.ticket = "";
            //datosPDF.nombreEmpleado = "";
            datosPDF.nombreEmpleado = this.datosSolicitud[0].tecnico;
            datosPDF.lstSolicitudes = this.datosSolicitud;
            pdfGeneral.pdfAcuseActas(datosPDF);
          }

          if(abrirMotivo) {
            msg += ". "+respuestaMotivo;
          }

          this.overlayRef.detach();
          this.dialogRef.close(true);
          this._snack.open(msg, "", { duration: 8000, panelClass: [tipoAlert ? "snack-ok" : "snack-error"] });
        }
      }))
      .subscribe(
        data => { 
         // console.log("data calificar: ", data);
          if(data["SUCCESS"]) { 
            contItems++;
            datosPDF.ticket = data["TICKET"];
            params.ticket = data["TICKET"];
            element.ticket = data["TICKET"];
            element.inicio = data["INICIO"];
            element.fin = data["FIN"];
            msg = data["MESSAGE"];
          } 
        },
        error => { contItems = contItems; }
      );
    });
    
  }

}

import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';
import readXlsxFile from 'read-excel-file';


@Component({
  selector: 'app-importador',
  templateUrl: './importador.component.html',
  styleUrls: ['./importador.component.scss']
})
export class ImportadorComponent implements OnInit {

  overlayRef: OverlayRef;

  input: any;
  showTable: boolean  = false;

  rowsData: any = [];
  nuevo: Servicio[] = [];
  displayedColumns: string[] = ['medio', 'cliente', 'sucursal','tipoServ','coordinador','ot','ticket','descripcion','observacion'];
  dataSource = new MatTableDataSource(this.nuevo);
  sessionData: any;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fileUploader',{static:true}) fileUploader:ElementRef;

  constructor(
    private _snack: MatSnackBar,
    
    private _service:GeneralService,
    private _overlay: Overlay,
    private datePipe: DatePipe,
    private _excelService: ExcelService, ) {
      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 
     }
    
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  charge = () => {
    try
    {
      this.input = (<HTMLInputElement>document.getElementById('input'));
      const schema = {
        'Medio':{
          prop :'medio',
          type: String
        },
        'Cliente':{
          prop :'cliente',
          type: String
        },
        'Sucursal':{
          prop :'sucursal',
          type: String
        },
        'Tipo de Servicio':{
          prop :'tiposervicio',
          type: String
        },
        'Coordinador':{
          prop :'coordinador',
          type: String
        },
        'OT':{
          prop :'ot',
          type: String
        },
        'Ticket':{
          prop :'ticket',
          type: String
        },
        'Descripcion del problema':{
          prop :'descripcion',
          type: String
        },
        'Observaciones':{
          prop :'observaciones',
          type: String
        }
      };

      this.input.addEventListener('change', () => {
        readXlsxFile(this.input.files[0], { schema }).then(({ rows, errors }) => {
          if(rows.length > 0){

            this.showTable = true;
            var obj;
            let actual =  0;
            rows.forEach((value,index) => {
                obj = new Servicio();
                obj = value;
                this.nuevo[index] = obj;
            });

            this.nuevo =  this.nuevo.filter(function(item){ return !!item;});
            this.dataSource.data = this.nuevo;
          }
        });     
      })
  }catch(Error){
    this._snack.open("Errors", "", { duration: 3000, panelClass: ["snack-error"] });
  }
  }

  procesar = () => {
    let fails: any[] = [];
    if(this.nuevo.length == 0)
    {
      this._snack.open("No hay datos para procesar", "", { duration: 3000, panelClass: ["snack-error"] });
    }
    else
    {
        let param = {
          usuario_id: this.sessionData.IdUsuario,
          datos : this.nuevo
        };
        this.carga();
        this._service.postData('mesaControl/nuevo/saveXls','',param).subscribe(
        data => {
          if(data["DATA"] == "OK")
          {
            this.limpiar();
            this.overlayRef.detach();
            this._snack.open("Datos Guardados", "", { duration: 3000, panelClass: ["snack-ok"] });
          }
          else
          {
            this.limpiar();
            this.overlayRef.detach();
            this._snack.open("Algunos datos no fueron guardados", "", { duration: 3000, panelClass: ["snack-error"] });

            let arra : any = data['DATA'];
            arra.forEach(function(reg){
             fails.push({ "Medio": reg.medio, "Cliente": reg.cliente, "Sucursal": reg.sucursal, "Tipo de Servicio": reg.tiposervicio, "Coordinador": reg.coordinador, "OT": reg.ot, "Ticket": reg.ticket, "Descripcion del problema": reg.descripcion, "Observaciones": reg.observaciones });
            });
            this._excelService.exportAsExcelFile(fails, "Errores");
            
          }
        }
      )
    }
  }

  carga = () => {
    let config = new OverlayConfig({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: this._overlay.position().global().centerHorizontally().centerVertically()
    });
    this.overlayRef = this._overlay.create(config);
    this.overlayRef.attach(new ComponentPortal(OverlayComponent));
  }

  limpiar = () => {
    this.dataSource.data = [];
    this.nuevo = [];
    this.showTable = false;
    this.fileUploader.nativeElement.value = null;
  }

}

export class Servicio {
  medio_id: string;
  cliente_id:string;
  sucursal_id:string;
  tiposervicio_id:string;
  coordinador_id:string;
  ot: string;
  ticket: number;
  descripcion: string;
  observaciones:string;

 }


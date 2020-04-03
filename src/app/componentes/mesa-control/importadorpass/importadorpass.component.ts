import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatTableDataSource, MatSort, MatPaginator, MatSnackBar } from '@angular/material';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'src/app/servicios/excel/excel.service';
import { OverlayComponent } from '../../overlay/overlay.component';
import readXlsxFile from 'read-excel-file';
import { count, finalize } from 'rxjs/operators';
import { error } from 'protractor';


@Component({
  selector: 'app-importadorpass',
  templateUrl: './importadorpass.component.html',
  styleUrls: ['./importadorpass.component.scss']
})
export class ImportadorpassComponent implements OnInit {
  overlayRef: OverlayRef;

  input: any;
  showTable: boolean  = false;

  rowsData: any = [];
  nuevo: Servicio[] = [];
  displayedColumns: string[] = ['medio', 'cliente', 'sucursal','tipoServ','coordinador','ot','ticket','descripcion','observacion'];
  dataSource = new MatTableDataSource(this.nuevo);

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('fileUploader',{static:true}) fileUploader:ElementRef;

  constructor(
    private _snack: MatSnackBar,
    
    private _service:GeneralService,
    private _overlay: Overlay,
    private datePipe: DatePipe,
    private _excelService: ExcelService, ) { }
    
  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  charge = () => {
    try
    {
      this.input = (<HTMLInputElement>document.getElementById('input'));
      const schema = {
        'id':{
          prop :'id',
          type: String
        },
        'nombre':{
          prop :'nombre',
          type: String
        },
        'email':{
          prop :'email',
          type: String
        },
        'contrasena':{
          prop :'contrasena',
          type: String
        },
        'pass':{
          prop :'pass',
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
          }
        });     
      })
  }catch(Error){
    this._snack.open("Errors", "", { duration: 3000, panelClass: ["snack-error"] });
  }
  }

  procesar = () => {
    let fails: any[] = [];
    let contador = 0;
    let errores = 0;
    let finalizado = false;
    if(this.nuevo.length == 0)
    {
      this._snack.open("No hay datos para procesar", "", { duration: 3000, panelClass: ["snack-error"] });
    }
    else
    {
        let sessionData = JSON.parse(localStorage['SessionConAct']);
         
        this.nuevo.forEach(item => {
          let param = {Id: item.id,Correo:item.email, Pwd: item.pass};
          this._service.postData('login/control/encrypt','',param).pipe(finalize(()=>{
         
          })).subscribe(
            data =>{
              if(data["SUCCESS"] == 1)
              {
                contador++;

                if(contador == this.nuevo.length)
                {
                  if(errores !=0)
                  {
                    this._snack.open("Algunos registros no fueron guardados", "", { duration: 30000, panelClass: ["snack-warning"] });
                  }
                  else
                  {
                    this._snack.open("Proceso finalizado correctamente", "", { duration: 30000, panelClass: ["snack-ok"] });

                  }
                }
              }
              else
              {
                /*
                errores++;
                this._snack.open("Hay errores", "", { duration: 30000, panelClass: ["snack-ok"] });
                fails.push({ "Id": item.id, "Correo": item.email, "Pwd": item.pass});
                */
              }
            }
           
          );
        })

        /*
        this._snack.open("finalizó foreach", "", { duration: 30000, panelClass: ["snack-ok"] });
        if(contador == this.nuevo.length)
        {
          this._snack.open("Datos procesados correctamente", "", { duration: 3000, panelClass: ["snack-ok"] });
        }
        else
        {
          this._snack.open("Algunos registros no se guardaron", "", { duration: 3000, panelClass: ["snack-error"] });
        }
        */

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
  id: string;
  nombre:string;
  email:string;
  contrasena:string;
  pass:string;

 }


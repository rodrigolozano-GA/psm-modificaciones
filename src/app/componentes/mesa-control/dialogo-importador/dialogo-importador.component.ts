import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar, MatTableDataSource, MatPaginator } from '@angular/material';
import readXlsxFile from 'read-excel-file';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Overlay } from '@angular/cdk/overlay';
import { pipe } from 'rxjs';
import { element } from 'protractor';


@Component({
  selector: 'app-dialogo-importador',
  templateUrl: './dialogo-importador.component.html',
  styleUrls: ['./dialogo-importador.component.scss']
})
export class DialogoImportadorComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  showTable: boolean  = false;

  nuevo: Servicio[] = [];
  displayedColumns: string[] = ['fechaProgramada','medio', 'cliente', 'sucursal','tipoServ','coordinador','ot',
                                'ticket','descripcion','observacion','refacciones'];
  //,'codigo','concepto','cantidad','precio','importe'
   constructor(
    private _snack: MatSnackBar,
    private _service:GeneralService,
    private _overlay: Overlay,
    public _dialogRef: MatDialogRef<DialogoImportadorComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  refacciones:RefServ[] = [];
  rowsData: any = [];
  ELEMENT_DATA:any = [[]];

  dataSource = new MatTableDataSource(this.nuevo);
  input: any;

  ngOnInit() {
  //this.dataSource.paginator = this.paginator;
    this.input = (<HTMLInputElement>document.getElementById('input'));
    const schema = {
      'Tipo':{
        prop :'tipo',
        type: String
      },
      'Fecha Programada':{
        prop :'fecha_programada_folio',
        type:Date
      },
      'Medio':{
        prop :'medio_id',
        type: String
      },
      'Cliente':{
        prop :'cliente_id',
        type: String
      },
      'Sucursal':{
        prop :'sucursal_id',
        type: String
      },
      'Tipo de servicio':{
        prop :'tiposervicio_id',
        type: String
      },
      'Coordinador':{
        prop :'coordinador_id',
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
      },
      'Codigo Servicio':{
        prop :'codigo',
        type: String,
        required: true
      },
      'Concepto':{
        prop :'concepto',
        type: String,
        required: true
      },
      'Cantidad':{
        prop :'cantidad',
        type: Number,
        required: true
      },
      'Precio':{
        prop :'precio',
        type: Number,
        required: true
      },
      'Importe':{
        prop :'importe',
        type: Number,
        required: true
      },
    };

    this.input.addEventListener('change', () => {
      readXlsxFile(this.input.files[0], { schema }).then(({ rows, errors }) => {
        if(rows.length > 0){
          var obj;
          let actual =  0;
          rows.forEach((value,index) => {
           
            if(value.tipo == 's')
            {
              this.rowsData.push(value); 
              obj = new Servicio();
              obj.tipo = 's';
              obj.cliente_id =value.cliente_id;
              obj.fecha_programada_folio = value.fecha_programada_folio;
              obj.medio_id = value.medio_id;
              obj.sucursal_id = value.sucursal_id;
              obj.tiposervicio_id = value.tiposervicio_id;
              obj.coordinador_id = value.coordinador_id;
              obj.ot = value.ot;
              obj.ticket = value.ticket;
              obj.descripcion = value.descripcion;
              obj.observaciones = value.observaciones;
              obj.refacciones = [];
              actual = index;
              this.nuevo[actual] = obj;
             }
             else if(value.tipo == 'r' && (obj != null || obj!= undefined))
             {
              var pro = new RefServ();
              pro.codigo = value.codigo;
              pro.concepto = value.concepto;
              pro.cantidad = value.cantidad;
              pro.importe = value.importe;
              pro.precio = value.precio;
              this.nuevo[actual].refacciones.push(value);
            }
       
                
           /* 
            console.log(element)
            this.rowsData.push(element);
            this.contador = this.contador + 1;
      
            if((element.tipo).toLowerCase() == 's')
            {
            this.nuevo.push(element);
            
            }
            else if((element.tipo).toLowerCase() == 'r')
            {
            
              this.refacciones.push(element);
            }         
           
            if(!element.hasOwnProperty('ot')){element.ot = null}
            if(!element.hasOwnProperty('ticket')){element.ticket = null}
            if(!element.hasOwnProperty('medio_id')){element.medio_id = null}
            if(!element.hasOwnProperty('cliente_id')){element.cliente_id= null}
            if(!element.hasOwnProperty('sucursal_id')){element.sucursal_id = null}
            if(!element.hasOwnProperty('tiposervicio_id')){element.tiposervicio_id = null}
            if(!element.hasOwnProperty('coordinador_id')){element.coordinador_id = null}
            */
           
           
          });
        
          this.nuevo =  this.nuevo.filter(function(item){ return !!item;});
        
          this.dataSource.data = this.nuevo;
         // console.log('this.dataSource.data  : ' ,  this.dataSource.data);
         // console.log('this.nuevo: ', this.nuevo);
         this.showTable = true;   
        }
      });     
    })
  }
  cargar = () => {
    this.rowsData.forEach((value,index) => {
     if(value.tipo.toLowerCase() == 's')
     {
      this._service.postData('mesaControl/nuevo/saveXls','',value)
      .subscribe( 
      
        data => {
          if(data['SUCCESS'])
          {
            
            let token = {
              IdUsuario : (data["DATA"])['IdUsuario'],
              Nombre : (data["DATA"])['NombreUsuario'],
              Correo : (data["DATA"])['Correo']
              }
            localStorage['Menus'] = JSON.stringify((data['DATA'])['Menus']);
            localStorage['SessionConAct'] = JSON.stringify(token);
          }
        
        }
        );
       /*
       this._service.postData('mesaControl/nuevo/saveXls','','').subscribe
       {
         data => {

          console.log("data: " , data);
         }
       } */
     }else 
     {
     // console.log(index," - REFACCION: ",value)
     }

    });

  }
/*
  uploadXlsx(event)
  {
    let opc = 1;
    if(opc == 1)
    {
      let schema = this.schemaServ;
      console.log("Next 0");
      if(event.target.files[0])
      {
        console.log("Next 1");
        readXlsxFile(event.target.files[0], { schema }).then(({ rows, errors }) => {
          if(errors.length!=0)
          {
            for(let error of errors)
            {
             // this.respuestas.push(JSON.stringify(error));
              console.log("Error -> " , error);
            }
          }
            Object.values(rows).forEach(dato => {
            this._dataService.postData("mesaControl/nuevo/saveservices","",dato).subscribe(
              data =>{
                console.log('data :' ,data);
              }
            ) 
            
            // this._dataService.postData<Folio[]>("mesaControl/seguimiento/all", "").subscribe(
            //console.log('Datos : ' , dato);
            //console.log('JSON='+ JSON.stringify(dato));
            });
          }); 
          
    }
   
  }
}
*/
 /*
cargar = () => {
  console.log("Datos: " , this.ELEMENT_DATA);
  this.ELEMENT_DATA.forEach((value,index)=>{
     
      if(Object.values(value).length == 13)
      {

      }
      console.log("Vlue:",Object.values(value).length)
      this._dataService.postData('login/control/accesos','','').subscribe(
        data => {
          console.log("-->",data) ; 
        }
      )
  
    if(Object.values(x).length == 13)
    {
      this._service.postData('login/control/accesos','','').subscribe(
        data => {
          if(data['SUCCESS'])
          {
           console.log("Data: " , data);
          }
         else
         {
            this.showSnack("El usuario no existe!");
          } 
        }
      )

    }
  
  });

}
*/
  cerrar = () => {
    this._dialogRef.close();
  }
  /*
  onFileSelect(event:any): void {
    try {
      let opc = 1;
      const file = event.target.files[0];
      let name = file.name;
      let ext = name.substring((name.indexOf('.') + 1), name.length)
      if(ext != 'xlsx' && ext != 'xls')
      {
        this._snack.open("Extension no soportado", "", { duration: 2000, panelClass: ["snack-error"] }); 
        return null;
      }
      
      const fReader = new FileReader()
      
      fReader.readAsDataURL(file)
      fReader.onloadend = (_event: any) => {
        this.filename = file.name;
        this.base64File = _event.target.result;
      }
      
      
      if(opc == 1)
      {
        let schema = this.schemaServ;
        
        if(file)
        {
          readXlsxFile(file, { schema }).then(({ rows, errors }) => {
            if(errors.length!=0)
            {
              for(let error of errors)
              {
               // this.respuestas.push(JSON.stringify(error));
              }
            }
              Object.values(rows).forEach(dato => {
              this._dataService.postData("mesaControl/nuevo/saveservices","",dato).subscribe(
                data =>{
                  console.log('data :' ,data);
                }
              ) 
              
              // this._dataService.postData<Folio[]>("mesaControl/seguimiento/all", "").subscribe(
              //console.log('Datos : ' , dato);
              //console.log('JSON='+ JSON.stringify(dato));
              });
            }); 
      }
     
    }

    } catch (error) {
      this.filename = null;
      this.base64File = null;
    }
  }
*/


}

export class Servicio {
  tipo: string ;
  fecha_programada_folio: Date;
  medio_id: string;
  cliente_id:string;
  sucursal_id:string;
  tiposervicio_id:string;
  coordinador_id:string;
  ot: string;
  ticket: number;
  descripcion: string;
  observaciones:string;
  refacciones: RefServ[] = [];

 }

 export class RefServ
 {
  codigo: string;
  concepto: string;
  cantidad: number;
  precio: number;
  importe: number;
 }

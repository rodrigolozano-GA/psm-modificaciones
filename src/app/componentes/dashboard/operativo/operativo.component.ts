import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Chart } from 'chart.js'

@Component({
  selector: 'app-operativo',
  templateUrl: './operativo.component.html',
  styleUrls: ['./operativo.component.scss']
})
export class OperativoComponent implements OnInit {

  ELEMENT_DATA: Datos[] = [];

  constructor( private _dataService: GeneralService) { }
  
  ngOnInit() {
    this.obtFolios();
  }
  
  obtFolios = () =>{
    this._dataService.postData<Datos[]>("mesaControl/seguimiento/obtFolios",'',{}).subscribe(
     data=> {
       this.ELEMENT_DATA = data["DATA"];

      }
    );
     this.ELEMENT_DATA.forEach(item =>{
       if(item.cantidad == null || item.cantidad == '')
       {
         item.cantidad = 0;
       }
     })
  }
}

export interface Datos 
{
  cantidad: any;
  estatus: string;
}
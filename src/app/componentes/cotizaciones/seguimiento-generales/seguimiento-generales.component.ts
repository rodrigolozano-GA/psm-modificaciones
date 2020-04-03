import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MatDialog, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import { ExcelService } from '../../../servicios/excel/excel.service';

import { Cotizacion } from '../../../clases/cotizaciones/Cotizacion';

import { DialogoCotizacionComponent } from '../dialogo-cotizacion/dialogo-cotizacion.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { Overlay, OverlayRef, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';



@Component({
  selector: 'app-seguimiento-generales',
  templateUrl: './seguimiento-generales.component.html',
  styleUrls: ['./seguimiento-generales.component.scss']
})
export class SeguimientoGeneralesComponent implements OnInit {
  selectedValue :any;
  ELEMENT_DATA: Cotizacion[] = [];
  estatus = new Map();

  vecsta : any = [];
  displayedColumns: string[] = [
    'numero',
    'folio', 
    'fechaRegistro', 
    'cliente', 
    'tipoServicio', 
    'estatus', 
    'actions'];

  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  selection = new SelectionModel<Cotizacion>(false, [])

  // Loader
	overlayRef: OverlayRef;

  constructor(private _dialog: MatDialog, private _snack: MatSnackBar, private _dataService: GeneralService,
    private _excelService: ExcelService,private _overlay: Overlay) { }


  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.mostrarCarga();
    this.ActualizarTabla();
    
  }

  busqueda = (filtro: string) => {
    let flag = false;
    switch(filtro.toLocaleLowerCase())
    {
      case "cancelado":{ filtro ='33'; flag = true;}break;
      case "no Aprobado" : { filtro = '35'; flag = true;}break;
      case "nuevo" : { filtro='32', flag = true;}break;
    }


    
       
      this.dataSource.filter = filtro.trim().toLowerCase();

    
  }

  dialogoNuevaCotizacion = () => {
    this._dialog.open(DialogoCotizacionComponent, {
      panelClass: 'dialog-cotizacion',
      data: { title: "Nueva Cotización", data: "holi", accion: 0 } //0 => Nuevo | 1 => Consultar
    })
  }

  dialogoVerCotizacion = (registro: Cotizacion) => {
    const dialogRef = this._dialog.open(DialogoCotizacionComponent, {
      panelClass: 'dialog-cotizacion',
      data: { title: "Detalle de cotización", data: registro, accion: 0 } //0 => Nuevo | 1 => Consultar
    })
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.ActualizarTabla();
      }
    })
  }

  exportAsExcel = () => {
    let data: any[] = [];

    if (this.dataSource.filteredData.length == 0) {
      this._snack.open("No existen registros para la descarga", "", {
        panelClass: "snack-validation",
        duration: 2000
      });
      return;
    }

    this.dataSource.filteredData.map(reg => {
      data.push({ "N°": reg.numero, "Folio": reg.folio, "Cliente": reg.cliente + reg.sucursal, "Tipo de Servicio": reg.tipoServicio});
    })
    this._excelService.exportAsExcelFile(data, "SeguimientoCotizaciones");
  }

  ActualizarTabla = () => {
    this._dataService.postData<Cotizacion[]>("cotizaciones/seguimiento/all", "").subscribe(
      data => {
        this.overlayRef.detach();
        
        this.ELEMENT_DATA = data["DATA"].filter(item => item.estatus_id != 34);
        this.dataSource.data = this.ELEMENT_DATA;
        let param: any = { };
        this.ActionPost("catalogos/estatus/all",param);
      },
      error => {
        this.overlayRef.detach();
        this._snack.open("Error al conectarse con el servidor", "", {
          duration: 2000,
          panelClass: ["snack-error"]
        });
      }
    );
  }

  ActionPost = (url:string, param : any) => {
		this._dataService.postData<any>(url, "", param).subscribe(
      data => {
      
          data["DATA"].filter(item=>item.tipo=="COTIZACIONES").forEach(element => {
            this.vecsta[element.id] = element.nombre;
          //this.estatus.set(element.id,element.nombre);
         
        });
            
      }
    );
    
  }


  selected = () => {
    if(this.selectedValue!=1)
    {
      this.dataSource.data = this.ELEMENT_DATA.filter(item => (item.estatus_id == this.selectedValue));
    }
    else
    {
      this.dataSource.data = this.ELEMENT_DATA;
    }
     
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


}


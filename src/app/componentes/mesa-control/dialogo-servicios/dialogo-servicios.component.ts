import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Servicio } from 'src/app/clases/MesaControl/Servicio';

@Component({
  selector: 'app-dialogo-servicios',
  templateUrl: './dialogo-servicios.component.html',
  styleUrls: ['./dialogo-servicios.component.scss']
})
export class DialogoServiciosComponent implements OnInit {

  dataServicio: Servicio[] = []
  servColumns: string[] = ['No'];
  dataServicios = new MatTableDataSource(this.dataServicio);
  @ViewChild('servPaginator', { static: true }) paginatorServ: MatPaginator;
  @ViewChild('tableServ', { static: true }) sortServ: MatSort;
  selection = new SelectionModel<Servicio>(false, [])

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dataServicios.data = this.data.data;
 
  }

  ngOnInit() {
    this.dataServicios.paginator = this.paginatorServ;
    this.dataServicios.sort = this.sortServ;
  }

  busqueda = (filtro: string) => {
    this.dataServicios.filter = filtro.trim().toLowerCase();
  }

}

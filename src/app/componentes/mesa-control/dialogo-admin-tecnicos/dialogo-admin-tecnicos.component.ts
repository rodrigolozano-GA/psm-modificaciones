import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Tecnico as TecnicoO } from '../../../clases/Operaciones/Tecnico';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, delay, finalize } from 'rxjs/operators';
import { MatTableDataSource, MatSort, MatPaginator, MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { OverlayRef, OverlayConfig, Overlay } from '@angular/cdk/overlay';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

export class TecnicosFolio {
  id: number;
  tecnicos: TecnicoO[];
}

@Component({
  selector: 'app-dialogo-admin-tecnicos',
  templateUrl: './dialogo-admin-tecnicos.component.html',
  styleUrls: ['./dialogo-admin-tecnicos.component.scss']
})
export class DialogoAdminTecnicosComponent implements OnInit {

  tecnicosOList: TecnicoO[] = [];
  tecnicosOPList: TecnicoO[] = [];
  tecnicosData: TecnicoO[] = [];
  tecnicoGeneral: TecnicoO;
  parTec: TecnicoO[] = [];
  auxTec: TecnicoO[] = [];
  comtador: number = 0;
  public tecnicosOFilteringCtrl: FormControl = new FormControl();
  public tecnicosOPFilteringCtrl: FormControl = new FormControl();
  public filteredTecnicosOList: ReplaySubject<TecnicoO[]> = new ReplaySubject<TecnicoO[]>(1);
  public filteredTecnicosOPList: ReplaySubject<TecnicoO[]> = new ReplaySubject<TecnicoO[]>(1);
  protected _onDestroy = new Subject<void>();
  public searching: boolean = false;

  tecnColumns: string[] = ['nempleado', 'nombre', 'actions'];
  dataTecnicos = new MatTableDataSource(this.tecnicosData);
  @ViewChild('tableTecn', { static: true }) sortTecs: MatSort;
  @ViewChild('tecPaginator', { static: true }) paginatorTecs: MatPaginator;
  titulo: string = "Administración de Técnicos";

  generalForm: FormGroup;
  overlayRef: OverlayRef;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogoAdminTecnicosComponent>,
    private _fb: FormBuilder,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay) {
      this.parTec = data.datos;
      this.titulo = this.data.titulo;
           
  }

  ngOnInit() {
    if(this.parTec.length != 0)
    {
      
      let auxA: any = [];
      auxA = this.parTec;
      auxA = auxA.filter(item => item.tipo == 1);
      let dat =auxA[0];
      this.tecnicoGeneral = dat;
    }
   
    let params: any = { zona_id: this.data.zona_id };
    this.ObtenerCombos("mesaControl/seguimiento/tecnicosZonaFolio", 1, params);
    this.filtroTecnicosO();
    
    this.dataTecnicos.sort = this.sortTecs;
    this.dataTecnicos.paginator = this.paginatorTecs;

    this.generalForm = this._fb.group({
      id: [],
      tecnico_principal: [this.tecnicoGeneral],
      tecnicos: [this.tecnicosData, [Validators.required]]
    })

    this.generalForm.patchValue({ id: this.data.id });
    
  }

  filtroTecnicosO = () => {
    this.tecnicosOFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.tecnicosOList) { return []; }
         
          return this.tecnicosOList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredTecnico => {
        this.searching = false;
        this.filteredTecnicosOList.next(filteredTecnico);
      }, error => {
        this.searching = false;
      });

    this.tecnicosOPFilteringCtrl.valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        takeUntil(this._onDestroy),
        debounceTime(200),
        map(search => {
          if (!this.tecnicosOPList) { return []; }

          return this.tecnicosOPList.filter(itm => itm.nombre.toLowerCase().indexOf(search) > -1);
        }),
        delay(500)
      )
      .subscribe(filteredTecnico => {
        this.searching = false;
        this.filteredTecnicosOPList.next(filteredTecnico);
      }, error => {
        this.searching = false;
      });

  }

  busqueda = (filtro: string) => {
    this.dataTecnicos.filter = filtro.trim().toLowerCase();
  }

  guardar = () => {
    this.ActionPost();
  }

  LlenarFilto = (tipo, event) => {
    if(event == "") {
      switch(tipo) {
        case 1: this.filteredTecnicosOPList.next(this.tecnicosOList); break;
        case 2: this.filteredTecnicosOList.next(this.tecnicosOList); break;
      }
    }
  }

  /*filtrarPor = (tipo, event) => {
    let params: any = { buscar: event };
    let url = "";
    url = 'catalogos/tecnicos/combo'; params = { buscar: event };
    console.log(params, url);
    this.ObtenerCombos(url, tipo, params);
  }*/

  ObtenerCombos(url: string, tipo: number, params: any = null) {
    this._dataService.postData<any>(url, "", params)
      .pipe(finalize(() => { if (this.overlayRef != undefined) { this.overlayRef.detach(); } }))
      .subscribe(
        data => {
          this.tecnicosOPList = data.DATA; this.searching = false; this.filteredTecnicosOPList.next(this.tecnicosOPList); //this.filtroTecnicos(); break;
          this.tecnicosOList = data.DATA; this.searching = false; this.filteredTecnicosOList.next(this.tecnicosOList); //this.filtroTecnicos(); break;
          const listaTecnicos = this.dataTecnicos.data;
         for(let i = 0; i < data.DATA.length; i++)
          {
            for(let w = 0 ; w < this.parTec.length; w++)
            {
              if(data.DATA[i].nombre == this.parTec[w].nombre)
              {
                if(this.parTec[w].tipo == 1)
                {
                  data.DATA[i].tipo = 1;
                  
                }
                else
                {
                  listaTecnicos.push(data.DATA[i]); // INSERTAR EN LA LISTA SOLO LOS QUE TENGAN ESTATUS == 0 
                }
              }
            }
          } 
          this.dataTecnicos.data = listaTecnicos;
        
        },
        error => {
          this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
        }
      );
  }

  removeTech = (item) => {
    let unselect = [] = this.tecnicosData.filter(x=>x.id_ztt != item.id_ztt);
    this.tecnicosData = unselect;
    this.dataTecnicos.data = this.tecnicosData;
    this.generalForm.patchValue({ tecnicos: this.dataTecnicos.data });
  }

  selectTecnicos = () => {
    let lista: any = [];
    if(this.generalForm.value.tecnico_principal == null || this.generalForm.value.tecnico_principal == undefined)
    {
      this._snack.open("Debe elegir un técnico principal.", "", { duration: 2000, panelClass: ["snack-error"] });
      return null;

    } 
    // Verificar que los técnicos seleccionados no se dupliquen
    this.generalForm.get("tecnicos").value.map(seleccionado => {
      if (!this.dataTecnicos.data.length) {
        if(this.generalForm.value.tecnico_principal.id != seleccionado.id){
          lista.push(seleccionado);
        }

      } else {

        if (!this.existe(seleccionado.nempleado)) {
          if(this.generalForm.value.tecnico_principal.id != seleccionado.id){
            lista.push(seleccionado);
          }
        }
      }
    });

    // Preparar datos para actualizar la tabla de técnicos seleccionado
    this.dataTecnicos.data = [];
    const listaTecnicos = this.dataTecnicos.data;
    //console.log("Lista Tecnicos antes: ", listaTecnicos);
    lista.forEach(item => {
      listaTecnicos.push(item);
    });
    //console.log("Lista Tecnicos después: ", listaTecnicos);
    this.dataTecnicos.data = listaTecnicos;
    this.generalForm.patchValue({ tecnicos: this.dataTecnicos.data });
    //console.log("form:", this.generalForm.value);
  }

  //Pendiente de que no se dupliquen los registros :/
  existe = (id: string): boolean => {
    this.dataTecnicos.data.map(reg => {
      if (reg.nempleado == id) {
        return true;
      }
    })
    return false;
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

  ActionPost = () => {

    this.mostrarCarga();
    let accion = 1;
    let contTecnico = 0;
    let banTecnico = 0;
    let varmsg = "";
    let TecnicosPostData = [];
    TecnicosPostData = this.generalForm.value.tecnicos != undefined ? this.generalForm.value.tecnicos : [];

    //Quitar si ya existe un tecnico principal
    if(this.generalForm.value.tecnico_principal != null || this.generalForm.value.tecnico_principal !=undefined) 
    {
      TecnicosPostData.forEach(function(value,index)
      {
        if(value.tipo == 1)
        {
          TecnicosPostData.splice(index,1);
        }
      });
      
      let item = this.generalForm.value.tecnico_principal;
      item.tipo = 1;
      TecnicosPostData.push(item);

    }
 
    let aux = [] = TecnicosPostData; 

    aux.filter(item => item.tipo == 1);
    if(aux.length == 0)
    {
      this._snack.open("No se han agregado técnicos", "", { duration: 2000, panelClass: ["snack-error"] }); 
      this.overlayRef.detach();
      return null;
    }
         
    TecnicosPostData.forEach(itemTecnico => {
     
      /*********     Guardar Técnicos     ****************/
      let detalleParams: any = {
        id: itemTecnico.id_ztt,
        tipo: itemTecnico.tipo,
        folio_id: this.data.id,
        accion: accion == 1 ? 1 : 0,
      };
      
      accion++;
    
      this._dataService.postData<any>('mesaControl/seguimiento/tecnicosFolio/save', "", detalleParams).pipe(
        finalize(() => {
          contTecnico++;
          if (contTecnico == this.generalForm.value.tecnicos.length) {
            this.overlayRef.detach();
     
            //this._snack.open(varmsg, "", { duration: 10000, panelClass: ["snack-ok"] });
            varmsg = varmsg == "Información almacenada con éxito" ? "" : ". "+varmsg;
            this.dialogRef.close({resultado: true, msg: varmsg});
          }
        })
      ).subscribe(
        dataS => { if(dataS["SUCCESS"]) { 
         // console.log("respuesta : ",dataS["SUCCESS"])
          banTecnico = banTecnico + 1; 
          varmsg = dataS["MESSAGE"]; }
        },
        errorS => { banTecnico = banTecnico; this.overlayRef.detach(); }
      );  
      /***************************************************/
    });
  }

}

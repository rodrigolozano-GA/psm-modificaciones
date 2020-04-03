import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { filter, tap, takeUntil, debounceTime, map, delay } from 'rxjs/operators';
import { Traslado } from 'src/app/clases/cotizaciones/Traslado';

export interface Origen {
  origen_id: number;
  origen: string;
}

export interface Destino {
  destino_id: number;
  destino: string;
}

export interface Viajes {
  origen: Origen;
  destino: Destino;
}



@Component({
  selector: 'app-dialogo-registro-traslado',
  templateUrl: './dialogo-registro-traslado.component.html',
  styleUrls: ['./dialogo-registro-traslado.component.scss']
})
export class DialogoRegistroTrasladoComponent implements OnInit {

  traslado: Traslado = new Traslado();
  localList: Traslado[] = []
  generalForm: FormGroup;

  permiteLocal: boolean = false;

  origenList = [
    /*{ origen_id: 1, origen: "Nombre origen 1" },
    { origen_id: 2, origen: "Nombre origen 2" },
    { origen_id: 3, origen: "Nombre origen 3" },
    { origen_id: 4, origen: "Nombre origen 4" },
    { origen_id: 5, origen: "Nombre origen 5" },
    { origen_id: 6, origen: "Nombre origen 6" },
    { origen_id: 7, origen: "Nombre origen 7" },
    { origen_id: 7, origen: "Nombre origen 17" },
    { origen_id: 7, origen: "Nombre origen 171" },
    { origen_id: 7, origen: "Nombre origen 57" },*/
  ]

  destinoList = [
    /*{ destino_id: 1, destino: "Nombre destino 1" },
    { destino_id: 2, destino: "Nombre destino 2" },
    { destino_id: 3, destino: "Nombre destino 3" },
    { destino_id: 4, destino: "Nombre destino 4" },
    { destino_id: 5, destino: "Nombre destino 5" },
    { destino_id: 6, destino: "Nombre destino 6" },
    { destino_id: 7, destino: "Nombre destino 7" }*/
  ]

  public origenCtrl: FormControl = new FormControl();
  public destinoCtrl: FormControl = new FormControl();

  public origenFilteringCtrl: FormControl = new FormControl();
  public destinoFilteringCtrl: FormControl = new FormControl();

  public searching: boolean = false;

  public filteredOrigenes: ReplaySubject<Origen[]> = new ReplaySubject<Origen[]>(1);
  public filteredDestinos: ReplaySubject<Destino[]> = new ReplaySubject<Destino[]>(1);

  protected _onDestroy = new Subject<void>();
  origenFilteringCtorigenes: any;

  constructor(
    public _dialogRef: MatDialogRef<DialogoRegistroTrasladoComponent>,
    private _FB: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      console.log("this.data ", this.data);
     }

  //Getter general
  generalGetter = (_campo) => {
    return this.generalForm.get(_campo);
  }

  ngOnInit() {
    //console.log('this.data.pcostokm: ', this.data.pcostokm);
    this.generalForm = this._FB.group({
      origen: [this.traslado.origen, [Validators.required]],
      origen_id: [this.traslado.origen_id],
      destino: [this.traslado.destino, [Validators.required]],
      destino_id: [this.traslado.origen_id],
      distancia: [this.traslado.distancia, [Validators.required, Validators.pattern('^\\s*(?=.*[1-9])\\d*(?:\\.\\d{1,2})?\\s*$')]],
      casetas: [this.traslado.casetas, [Validators.required]],
      costokm: [this.data.pcostokm, [Validators.required]]
    });

    this.filtroOrigen();
    this.filtroDestino();

    //this._localStorageInit();
  }

  registrar = () => {
    if (!this.generalForm.valid) {
      this.generalForm.markAllAsTouched();
      //console.log("invalido:",this.generalForm.value);
      return;
    }

   // this.guardarTraslado();

   // this._localStorageSave();

    //console.log("this.generalForm.value ", this.generalForm.value);

    this._dialogRef.close(this.generalForm.value);
  }

  filtroOrigen = () => {
    this.generalForm.get("origen").valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        map(search => {
          if (!this.origenList) {
            return [];
          }

          // simulate server fetching and filtering data
          return this.origenList.filter(origenl => origenl.origen.toLowerCase().indexOf(search) > -1);
        })
      )
      .subscribe(filteredOrigenes => {
        this.searching = false;
        this.filteredOrigenes.next(filteredOrigenes);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });
  }

  filtroDestino = () => {
    this.generalForm.get("destino").valueChanges
      .pipe(
        filter(search => !!search),
        tap(() => this.searching = true),
        map(search => {
          if (!this.destinoList) {
            return [];
          }

          // simulate server fetching and filtering data
          return this.destinoList.filter(destinol => destinol.destino.toLowerCase().indexOf(search) > -1);
        })
      )
      .subscribe(filteredDestinos => {
        this.searching = false;
        this.filteredDestinos.next(filteredDestinos);
      },
        error => {
          // no errors in our simulated example
          this.searching = false;
          // handle error...
        });
  }

  guardarTraslado = () => {
    let origentxt = this.generalForm.get("origen").value.toLowerCase();
    let destinotxt = this.generalForm.get("destino").value.toLowerCase();
    let existe: boolean = false;

    //Validar si existe ya el registro
    let abc = this.localList.findIndex(ref => ref.origen.toLowerCase() == origentxt && ref.destino.toLowerCase() == destinotxt);
    this.localList[abc] = this.generalForm.value;

    if (abc > -1) {
      //Existe y se actualizó
      return;
    }

    //No existe
    this.localList.push(this.generalForm.value);
  }

  private _localStorageInit = () => {

    if (!window.localStorage) {
      //console.log("Este exporador no permite local storage, por lo cual no se guardarán coincidencias en viajes");
      this.permiteLocal = false;
    }

    if (localStorage.length > 0) {

      this.localList = JSON.parse(localStorage.getItem('viajes'));
      if (this.localList == null || this.localList.length == 0) {
        localStorage.setItem("viajes", "");
        return;
      }

    }

  }

  private _localStorageSave = () => {
  
   localStorage.setItem("viajes", JSON.stringify(this.localList));
  }


  seleccion = (event: MatAutocompleteSelectedEvent) => {
    //console.log(event);
    if (event.option.value.costokm) {
      this.generalForm.patchValue({
        origen: event.option.value.origen,
        origen_id: event.option.value.origen_id,
        casetas: event.option.value.casetas,
        costokm: event.option.value.costokm,
        destino: event.option.value.destino,
        destino_id: event.option.value.destino_id,
        distancia: event.option.value.distancia
      }, { emitEvent: false });
    } else {
      this.generalForm.patchValue({ origen: event.option.value.origen, origen_id: event.option.value.origen_id }, { emitEvent: false });
    }
    
  }

  seleccionDestino = (event: MatAutocompleteSelectedEvent) => {
    //console.log(event);
    this.generalForm.patchValue({ destino: event.option.value.destino, destino_id: event.option.value.destino_id }, { emitEvent: false });
  }

}

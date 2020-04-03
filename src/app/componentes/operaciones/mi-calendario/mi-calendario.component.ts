import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { MatDialog, MatSnackBar } from '@angular/material';
import { DialogoInformacionComponent } from '../dialogo-informacion/dialogo-informacion.component';
import { GeneralService } from 'src/app/servicios/general/general.service';
import { OverlayConfig, OverlayRef, Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { OverlayComponent } from '../../overlay/overlay.component';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  },
  armstrong: {
    primary: "#17a2b8",
    secondary: "#2b297e8a"
  }
};

@Component({
  selector: 'app-mi-calendario',
  templateUrl: './mi-calendario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./mi-calendario.component.scss']
})
export class MiCalendarioComponent implements OnInit {
  view: CalendarView = CalendarView.Month;

  locale: string = 'es';
  CalendarView = CalendarView;

  viewDate: Date = new Date();

  overlayRef: OverlayRef;

  datosFolio: any = {};

  infoEncabezado: any = {
    servicios: 0,
    correctivos: 0,
    preventivos: 0,
    instalaciones: 0
  };

  events: CalendarEvent[] = [
    /*{
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: `190730113256517 - 10:00 Plaza revolución #360, Guadalajara 1`,
      color: colors.armstrong,
      allDay: true,
      draggable: false,
      meta: { id: 129 }
    },
    {
      start: startOfDay(new Date()),
      title: '190730113256517 - 10:00 Plaza revolución #360, Guadalajara 2',
      color: colors.armstrong,
      meta: { id: 129 }
    }*/
  ];

  refresh: Subject<any> = new Subject();
  sessionData: any;

  constructor(
    private _dialog: MatDialog,
    private _dataService: GeneralService,
    private _snack: MatSnackBar,
    private _overlay: Overlay
    ) { 

      this.sessionData = JSON.parse(localStorage.getItem('SessionConAct')) 

    }

  ngOnInit() {
    this.cambioVista(new Date());
  }

  activeDayIsOpen: boolean = true;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });

  }

  setView(view: CalendarView) {
    this.view = view;
  }

  eventClicked({ event }: { event: CalendarEvent }): void {
   // console.log('Event clicked', event);
    this.dialogoSeguimiento(event);
  }

  refreshView(): void {
    this.refresh.next();
  }

  dialogoSeguimiento = (evento) => {
    let folio: any = {};
    this.datosFolio.forEach(item => {
      if(item.id == evento.meta.id) {
        folio = item;
      }
    });
    //console.log("click folio: ", folio);
    const dialogRef = this._dialog.open(DialogoInformacionComponent, {
      panelClass: 'dialog-seguimiento',
      data: { accion: 1, data: folio }
    })
  }

  cambioVista = ($event) => {
    let fechaActual = $event;
    /*
    let obtPrimerDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth()+1, 1);
    let obtUltimoDia = new Date(fechaActual.getFullYear(), fechaActual.getMonth()+1, 0);

    let fechaInicioMes = fechaActual.getFullYear() + '/' + this.completarMes(fechaActual.getMonth()+1) + '/' + this.completarMes(obtPrimerDia.getDate());
    let fechaFinMes = fechaActual.getFullYear() + '/' + this.completarMes(fechaActual.getMonth()+1) + '/' + this.completarMes(obtUltimoDia.getDate());
    */
    let params: any = {};
    //params.fechaInicio = fechaInicioMes;
    //params.fechaFin = fechaFinMes;
    params.mes = fechaActual.getMonth()+1;
    params.usuario_id = this.sessionData.IdUsuario;
    this.mostrarCarga();
    this.ActualizarCalendario(params);
  }

  completarMes = (mes) => {
    return (mes+"").length > 1 ? mes : "0"+mes;
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

  ActualizarCalendario = (params: any = null) => {
    this._dataService.postData<any[]>("operaciones/miCalendario/servicios", "", params).subscribe(
      data => {
        this.overlayRef.detach();
        this.events = [];
        this.infoEncabezado.servicios = 0;
        this.infoEncabezado.preventivos = 0;
        this.infoEncabezado.correctivos = 0;
        this.infoEncabezado.instalaciones = 0;
        this.refreshView();

        this.datosFolio = data["DATA"];

        let obj:any = {};

        this.infoEncabezado.servicios = data["DATA"].length;

        this.datosFolio.forEach(item => {
          switch(item.tiposervicio.toLowerCase()) {
            case "preventivo": this.infoEncabezado.preventivos++; break;
            case "correctivo": this.infoEncabezado.correctivos++; break;
            case "instalaciones": this.infoEncabezado.instalaciones++; break;
          }

          obj = {};

          if(item.fecha_programada) {
            let fechaP = item.fecha_programada;
            obj.start = startOfDay(new Date(fechaP.split('/')[1]+'-'+fechaP.split('/')[0]+'-'+fechaP.split('/')[2]));
            obj.title = item.folio + ' - ' + item.direccion;
            obj.color = colors.armstrong;
            obj.meta = { id: item.id };

            this.events.push(obj);
          }
        });
        // Actualizar la vista del calendario
        this.refreshView();
      },
      error => {
        this.overlayRef.detach();
        this._snack.open("Error al conectarse con el servidor", "", { duration: 2000, panelClass: ["snack-error"] });
      }
    );
  }

}

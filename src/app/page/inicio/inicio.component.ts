import { Component, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';

// plugins;
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import listPlugin from '@fullcalendar/list'; // a plugin!
import timegridPlugin from '@fullcalendar/timegrid'; // a plugin!
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import esLocale from '@fullcalendar/core/locales/es';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpService } from 'src/app/Service/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MatDialog } from '@angular/material/dialog';
import { ShowEventComponent } from 'src/app/modal/show-event/show-event.component';
import * as moment from 'moment';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { Router } from '@angular/router';
@Component({
  selector: 'app-inicio',
  styleUrls: ['./inicio.component.scss'],
  templateUrl: './inicio.component.html',
})
export class InicioComponent {
  // @ViewChild('fullCalendarval') fullcalendarval: FullCalendarComponent | any;
  // data: any = '';
  viewDate: Date = new Date();
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      listPlugin,
      timegridPlugin,
      bootstrap5Plugin,
      momentTimezonePlugin,
    ],
    themeSystem: 'bootstrap5',
    customButtons: {
      myCustomButton: {
        text: '¡costumbre!',
        click: function () {
          alert('clicked the custom button!');
        },
      },
    },
    // eventDrop: this.eventupdatecalendar.bind(this),
    // eventResize: this.eventupdatecalendar.bind(this),
    // eventClick: this.verCliente.bind(this),
    // select: this.verCliente.bind(this),
    editable: false,
    navLinks: true, // puede hacer clic en los nombres de día/semana para navegar por las vistas
    dayMaxEvents: true, // Permitir un enlace "más" cuando hay demasiados eventos
    droppable: false,
    // Habilita el cursor sobre los eventos sin habilitar la edición
    eventMouseEnter: function (info) {
      // Cambia el estilo del puntero del mouse al pasar sobre el evento
      info.el.style.cursor = 'pointer';
    },
    eventMouseLeave: function (info) {
      // Restaura el estilo del puntero del mouse al salir del evento
      info.el.style.cursor = '';
    },
    weekends: true,
    selectable: true,
    locale: esLocale,
    timeZone: 'America/La_Paz',
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialDate: this.viewDate,
    // events: [{ title: 'Meeting', start: new Date() }],
    events: (info, successCallback, failureCallback) => {
      const dataval = {
        start: info.startStr,
        end: info.endStr,
      };
      const body = new HttpParams({ fromObject: dataval });
      // this._http.get('cita', body).subscribe({
      //   next: (data: any) => {
      //     successCallback(data.data);
      //   },
      //   error: (err: any) => {
      //     failureCallback(err);
      //   },
      //   complete: () => {},
      // });
    },
    // scrollTime: '00:05', // Habilita el desplazamiento horizontal en la vista de mes
    height: '80vh', // Ajusta la altura automáticamente según el contenido
    // height: 'auto', // will activate stickyHeaderDates automatically!
    // slotDuration: '00:05:00', // very small slots will make the calendar really tall
    // dayMinWidth: 150, // will cause horizontal scrollbars
  };
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private spinner: NgxSpinnerService
  ) {}
  // eventupdatecalendar(info: any) {
  //   // this.spinner.show();
  //   // console.log(info);
  //   if (info.event && info.event.extendedProps) {
  //     const cita = info.event.extendedProps.data;
  //     const datos = {
  //       cliente_id: cita.cliente_id,
  //       estado: cita.estado,
  //       etapa: cita.etapa,
  //       id: cita.id,
  //       resumen: cita.resumen,
  //       start: moment(info.event.startStr).format('YYYY-MM-DD hh:mm:ss'),
  //       end: moment(info.event.endStr).format('YYYY-MM-DD hh:mm:ss'),
  //     };
  //     this.updatecita(datos);
  //   }
  //   // moment(this.pago.fecha).format('YYYY-MM-DD hh:mm:ss');
  //   // let data = {
  //   //   id: info.event.id,
  //   //   cliente_id: info.event.extendedProps.data.cliente_id,
  //   //   home_id: info.event.extendedProps.data.home_id,
  //   //   start: this.formatDate(info.event.start),
  //   //   end: this.formatDate(info.event.end),
  //   //   descripcion: info.event.extendedProps.data.descripcion,
  //   // };
  //   //console.log(data);
  //   // this.restangular
  //   //   .all('agendas')
  //   //   .customPUT(data, data.id)
  //   //   .subscribe(
  //   //     (response:any) => {
  //   //       //console.log(response);
  //   //       this.spinner.hide();
  //   //       this.snackBar.open(response.message, ':-)', {
  //   //         duration: 3000,
  //   //       });
  //   //     },
  //   //     () => {
  //   //       this.spinner.hide();
  //   //     }
  //   //   );
  // }
  // showEvent(info: any) {
  //   //console.log("logueado");
  //   // this.spinner.show();
  //   //console.log("showEvent");
  //   // console.log(info);
  //   // this.dataForm.patchValue({
  //   //   start: info.startStr,
  //   //   end: info.endStr,
  //   // });
  //   if (info.event && info.event.extendedProps) {
  //     this.dialog.open(ShowEventComponent, {
  //       data: info.event.extendedProps.data,
  //     });
  //   }
  // }
  // verCliente(data: any) {
  //   // console.log(data);
  //   if (data.event && data.event.extendedProps) {
  //     // const dialogRef = this.dialog.open(ClienteViewComponent, {
  //     //   width: '95vw',
  //     //   maxWidth: '95vw',
  //     //   // minHeight: '95vh',
  //     //   disableClose: true,
  //     //   data: { data: data.event.extendedProps.data.cliente },
  //     // });
  //     this.router.navigate([
  //       '/cliente',
  //       data.event.extendedProps.data.cliente.id,
  //     ]);
  //   }
  //   // dialogRef.afterClosed().subscribe((result) => {
  //   //   console.log(`Dialog result: ${result}`);
  //   //   if (result) {
  //   //     this.loadData();
  //   //   }
  //   // });
  // }
  // updatecita(data: any) {
  //   this.spinner.show();
  //   this._http.put(`cita/${data.id}`, data).subscribe({
  //     next: (response) => {
  //       // console.log(response);
  //       // this.cargar();
  //       // console.log(response);
  //       this.spinner.hide();
  //       // this.cancelar();
  //       this.snackBar.open(response.mensaje, ':-)', {
  //         duration: 3000,
  //       });
  //       // this.dialogRef.close(true);
  //     },
  //     error: (msg) => {
  //       this.spinner.hide();
  //       this.snackBar.open(msg, ':-(', {
  //         duration: 3000,
  //       });
  //     },
  //     complete: () => {
  //       this.spinner.hide();
  //     },
  //   });
  // }
  // enviarrecordatorio() {
  //   const dialogRef = this.dialog.open(ConfirmacionComponent, {
  //     width: '250px',
  //     data: {
  //       title:
  //         '¿Estás seguro de enviar el recordatorio a los clientes con cita mañana?',
  //     },
  //   });
  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result) {
  //       this.spinner.show();
  //       this._http.get(`emails`).subscribe({
  //         next: (response) => {
  //           // console.log(response);
  //           this.message(response.mensaje);
  //         },
  //         error: (err) => {
  //           this.message(err);
  //           this.spinner.hide();
  //         },
  //         complete: () => {
  //           this.spinner.hide();
  //         },
  //       });
  //     }
  //   });
  // }
  // message(m: string): void {
  //   this.snackBar.open(m, 'Cerrar', {
  //     duration: 4000,
  //   });
  // }
}

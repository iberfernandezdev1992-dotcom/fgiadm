import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Calendar, CalendarOptions } from '@fullcalendar/core';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
// plugins;
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!
import listPlugin from '@fullcalendar/list'; // a plugin!
import timegridPlugin from '@fullcalendar/timegrid'; // a plugin!
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import esLocale from '@fullcalendar/core/locales/es';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-form-cita',
  styleUrls: ['./form-cita.component.scss'],
  templateUrl: './form-cita.component.html',
})
export class FormCitaComponent implements OnDestroy, OnInit {
  @ViewChild('fullCalendarval') fullcalendarval: Calendar | any;
  dataForm: FormGroup;
  dialogTitle: string = '';
  data: any = '';
  clientedata: any;
  viewDate: Date = new Date();
  calendarOptions: CalendarOptions = {
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      listPlugin,
      timegridPlugin,
      bootstrap5Plugin,
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
    eventDrop: this.eventupdatecalendar.bind(this),
    eventResize: this.eventupdatecalendar.bind(this),
    eventClick: this.showEvent.bind(this),
    select: this.showEvent.bind(this),
    editable: false,
    navLinks: true, // puede hacer clic en los nombres de día/semana para navegar por las vistas
    dayMaxEvents: true, // Permitir un enlace "más" cuando hay demasiados eventos
    droppable: false,
    weekends: true,
    selectable: true,
    locale: esLocale,
    initialView: 'timeGridWeek',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    height: '80vh',
    initialDate: this.viewDate,
    // events: [{ title: 'Meeting', start: new Date() }],
    events: (info, successCallback, failureCallback) => {
      const dataval = {
        start: info.startStr,
        end: info.endStr,
      };
      const body = new HttpParams({ fromObject: dataval });
      this._http.get('cita', body).subscribe({
        next: (data: any) => {
          successCallback(data.data);
        },
        error: (err: any) => {
          failureCallback(err);
        },
        complete: () => {},
      });
    },
  };
  title = 'Crear';
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.clientedata = _data.data;
    if (_data.cita) {
      // console.log(_data.cita);

      this.title = 'Editar';
      this.data = _data.cita;
    }
    this.dataForm = this.createForm();
  }

  public ngOnInit(): void {}

  public ngOnDestroy(): void {}

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.id],
      cliente_id: [
        this.clientedata.id,
        Validators.compose([Validators.required]),
      ],
      etapa: [
        this.data.etapa ? this.data.etapa : 'primera',
        Validators.compose([Validators.required]),
      ],
      estado: [
        this.data.estado ? this.data.estado : 'pendiente',
        Validators.compose([Validators.required]),
      ],
      resumen: [this.data.resumen],
      start: [this.data.start, Validators.compose([Validators.required])],
      end: [this.data.end, Validators.compose([Validators.required])],
    });
  }

  eventupdatecalendar(info: any) {
    // this.spinner.show();
    // console.log(info);
    let data = {
      id: info.event.id,
      cliente_id: info.event.extendedProps.data.cliente_id,
      home_id: info.event.extendedProps.data.home_id,
      start: this.formatDate(info.event.start),
      end: this.formatDate(info.event.end),
      descripcion: info.event.extendedProps.data.descripcion,
    };
    //console.log(data);
    // this.restangular
    //   .all('agendas')
    //   .customPUT(data, data.id)
    //   .subscribe(
    //     (response:any) => {
    //       //console.log(response);
    //       this.spinner.hide();
    //       this.snackBar.open(response.message, ':-)', {
    //         duration: 3000,
    //       });
    //     },
    //     () => {
    //       this.spinner.hide();
    //     }
    //   );
  }

  showEvent(info: any) {
    //console.log("logueado");
    // this.spinner.show();
    //console.log("showEvent");
    // console.log(info);
    this.dataForm.patchValue({
      start: this.formatDate(info.startStr),
      end: this.formatDate(info.endStr),
    });
    // console.log(this.dataForm.value);

    // let dataval = {
    //   id: '',
    //   start: '',
    //   end: '',
    //   cliente_id: '',
    //   agendaable_id: '',
    //   agendaable_type: '',
    //   googleid: '',
    //   descripcion: '',
    // };
    // if (info.startStr) {
    //   dataval.start = this.formatDate(info.start).replace(/ /g, 'T'); //info.startStr+"T00:00:00";
    //   dataval.end = this.formatDate(info.end).replace(/ /g, 'T'); //info.endStr+"T00:00:00";
    // } else {
    //   dataval = {
    //     id: info.event.id,
    //     start: info.event.extendedProps.data.start,
    //     end: info.event.extendedProps.data.end,
    //     cliente_id: info.event.extendedProps.data.cliente_id,
    //     agendaable_id: info.event.extendedProps.data.agendaable_id,
    //     agendaable_type: info.event.extendedProps.data.agendaable_type,
    //     googleid: info.event.extendedProps.data.googleid,
    //     descripcion: info.event.extendedProps.data.descripcion,
    //   };
    // }

    // if (info.event) {
    //   //console.log("edit");
    //   if (dataval.agendaable_type == 'App\\Demanda') {
    //     info.event.extendedProps.data.agendaable.poligonos = JSON.parse(
    //       info.event.extendedProps.data.agendaable.poligonos
    //     );
    //   }
    //   this.openDialog(
    //     'edit',
    //     dataval,
    //     info.event.extendedProps.data.cliente,
    //     info.event.extendedProps.data.agendaable
    //       ? info.event.extendedProps.data.agendaable
    //       : null
    //   );
    // } else {
    //   //console.log("add");
    //   this.openDialog('add', dataval, '', '');
    //   // this.openDialog('add',data);
    // }
    // this.mostrarModal(data.event.extendedProps.data);
  }
  openDialog(accion: any, dato: any, cliente: any, homedemanda: any): void {
    // const dialogRef = this.dialog.open(FormAgendaComponent, {
    //   // width: '550px',
    //   width: '100vw',
    //   disableClose: true,
    //   data: {
    //     accion: accion,
    //     data: dato,
    //     cliente: cliente,
    //     homedemanda: homedemanda,
    //   },
    // });
    // dialogRef.afterClosed().subscribe((result) => {
    //   //console.log('The dialog was closed');
    //   // //console.log(result);
    //   this.cd.detectChanges();
    //   //console.log(this.fullCalendar);
    //   this.fullCalendar.calendar.refetchEvents();
    //   // this.$refs.calendar.$emit('eventSource');
    // });
  }

  guardar() {
    this.spinner.show();
    const data1 = this.dataForm.value;
    data1.start = this.formatDate(data1.start);
    data1.end = this.formatDate(data1.end);
    if (!data1.id) {
      this._http.post('cita', data1).subscribe({
        next: (response) => {
          // console.log(response);
          // this.cargar();
          // console.log(response);
          // this.spinner.hide();
          // this.cancelar();
          this.snackBar.open(response.mensaje, ':-)', {
            duration: 3000,
          });
          this.dataForm.reset();
          // this.fullcalendar.$emit('eventSource');
          this.fullcalendarval.calendar.refetchEvents();
          this.dialogRef.close(true);
        },
        error: (msg) => {
          this.spinner.hide();
          this.snackBar.open(msg, ':-(', {
            duration: 3000,
          });
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    } else {
      this._http.put(`cita/${data1.id}`, data1).subscribe({
        next: (response) => {
          // console.log(response);
          // this.cargar();
          // console.log(response);
          // this.spinner.hide();
          // this.cancelar();
          this.snackBar.open(response.mensaje, ':-)', {
            duration: 3000,
          });
          this.dataForm.reset();
          this.fullcalendarval.calendar.refetchEvents();
          this.dialogRef.close(true);
        },
        error: (msg) => {
          this.spinner.hide();
          this.snackBar.open(msg, ':-(', {
            duration: 3000,
          });
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }

  formatDate(date: any) {
    let options: any = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
    let data = new Date(date)
      .toLocaleDateString('sv-SE', options)
      .replace(/\//g, '-');
    return data;
  }
}

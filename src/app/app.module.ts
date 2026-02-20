import { CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule,NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { importProvidersFrom } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  VERSION as MAT_VERSION,
  MatNativeDateModule,
} from '@angular/material/core';
import { AuthService } from './Service/auth.service';
import { LoginComponent } from './page/login/login.component';
import { AuthInterceptor } from './Service/auth.interceptor';
import { CuentaComponent } from './page/cuenta/cuenta.component';
import { ClienteComponent } from './page/cliente/cliente.component';
import { HttpService } from './Service/http.service';
import { FormClienteComponent } from './modal/form-cliente/form-cliente.component';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { QuillModule } from 'ngx-quill';

import * as QuillNamespace from 'quill';
let Quill: any = QuillNamespace;
import ImageResize from 'quill-image-resize-module';
import { ConfirmacionComponent } from './modal/confirmacion/confirmacion.component';
import { ServicioComponent } from './page/servicio/servicio.component';
import { UserComponent } from './page/user/user.component';
import { FormUserComponent } from './modal/form-user/form-user.component';
import { FormCitaComponent } from './modal/form-cita/form-cita.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FormAddCitaComponent } from './modal/form-add-cita/form-add-cita.component';
import { InicioComponent } from './page/inicio/inicio.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { FlatpickrModule } from 'angularx-flatpickr';
import { ClienteViewComponent } from './page/cliente-view/cliente-view.component';
import { ReportesComponent } from './page/reportes/reportes.component';
import { ShowEventComponent } from './modal/show-event/show-event.component';
import { TableCitaComponent } from './page/cliente-view/table-cita/table-cita.component';
import { FormServicioComponent } from './modal/form-servicio/form-servicio.component';
import { VerDatosComponent } from './modal/ver-datos/ver-datos.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { ClienteShowComponent } from './page/cliente-show/cliente-show.component';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { ErrorComponent } from './modal/error/error.component';
import { PaisComponent } from './page/pais/pais.component';
import { CiudadComponent } from './page/ciudad/ciudad.component';
import { RangoComponent } from './page/rango/rango.component';
import { InstructorComponent } from './page/instructor/instructor.component';
import { FormPaisComponent } from './modal/form-pais/form-pais.component';
import { FormCiudadComponent } from './modal/form-ciudad/form-ciudad.component';
import { FormRangoComponent } from './modal/form-rango/form-rango.component';
import { FormInstructorComponent } from './modal/form-instructor/form-instructor.component';
import { FormCertificacionComponent } from './modal/form-certificacion/form-certificacion.component';
import { CertificacionComponent } from './page/certificacion/certificacion.component';
import { FormVolumenComponent } from './modal/form-volumen/form-volumen.component';
import { VolumenComponent } from './page/volumen/volumen.component';
import { FormMaterialComponent } from './modal/form-material/form-material.component';
import { MaterialComponent } from './page/material/material.component';
import { FormEventoComponent } from './modal/form-evento/form-evento.component';
import { EventoComponent } from './page/evento/evento.component';
import { FormGastoComponent } from './modal/form-gasto/form-gasto.component';
import { GastoComponent } from './page/gasto/gasto.component';
import { FormIndumentariaComponent } from './modal/form-indumentaria/form-indumentaria.component';
import { IndumentariaComponent } from './page/indumentaria/indumentaria.component';
import { FormGaleriaComponent } from './modal/form-galeria/form-galeria.component';
import { GaleriaComponent } from './page/galeria/galeria.component';
import { FormGimnasioComponent } from './modal/form-gimnasio/form-gimnasio.component';
import { GimnasioComponent } from './page/gimnasio/gimnasio.component';
import { FormActividadComponent } from './modal/form-actividad/form-actividad.component';
import { ActividadComponent } from './page/actividad/actividad.component';
import { VerInstructorComponent } from './page/ver-instructor/ver-instructor.component';
import { FormCompraComponent } from './modal/form-compra/form-compra.component';

import { FormActividadInstructorComponent } from './modal/form-actividad-instructor/form-actividad-instructor.component';
import { FormVentaIndumentariaComponent } from './modal/form-venta-indumentaria/form-venta-indumentaria.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { ActividadShowComponent } from './page/actividad-show/actividad-show.component';
import { VerProgramaComponent } from './modal/ver-programa/ver-programa.component';
import { ListIndumentariaPedidoComponent } from './page/list-indumentaria-pedido/list-indumentaria-pedido.component';
import { VerIndumentariaPedidoComponent } from './modal/ver-indumentaria-pedido/ver-indumentaria-pedido.component';
import { VerInscripcionCertificacionDetalleComponent } from './modal/ver-inscripcion-certificacion-detalle/ver-inscripcion-certificacion-detalle.component';
import { FormExamenComponent } from './modal/form-examen/form-examen.component';
import { VerPreguntasRespuestasComponent } from './page/ver-preguntas-respuestas/ver-preguntas-respuestas.component';
import { ConfirmDialogComponent } from './page/ver-preguntas-respuestas/confirm/confirm.component';
import { FormPreguntasComponent } from './modal/form-preguntas/form-preguntas.component';
import { ConfirmDialogComponentEx } from './modal/ver-programa/confirm/confirm.component';
import { FormMaterialApoyoComponent } from './modal/form-material-apoyo/form-material-apoyo.component';
import { FormCompraActividadComponent } from './modal/form-compra-actividad/form-compra-actividad.component';
import { VerInscripcionTallerDetalleComponent } from './modal/ver-inscripcion-taller-detalle/ver-inscripcion-taller-detalle.component';
import { ComprasActualizacionesComponent } from './page/compras-actualizaciones/compras-actualizaciones.component';

registerLocaleData(localeEs, 'es');
// const imageDrop = ImageDrop.default;
Quill.register('modules/imageResize', ImageResize);
Quill.register('modules/imageDrop', ImageResize);
var editor_modules = {
  toolbar: {
    container: [
      [{ font: [] }],
      [{ size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: 1 }, { header: 2 }],
      [{ color: [] }, { background: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      // ['link', 'image', 'video'],
    ],
  },
  // imageResize: true,
  // imageDrop: true,
};
@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    LoginComponent,
    CuentaComponent,
    ClienteComponent,
    FormClienteComponent,
    ConfirmacionComponent,
    ServicioComponent,
    UserComponent,
    FormUserComponent,
    FormCitaComponent,
    FormAddCitaComponent,
    ClienteViewComponent,
    ReportesComponent,
    VerInscripcionTallerDetalleComponent,
    ShowEventComponent,
    TableCitaComponent,
    FormServicioComponent,
    VerDatosComponent,
    ClienteShowComponent,
    ActividadShowComponent,
    VerProgramaComponent,
    // news
    PaisComponent,
    FormPaisComponent,
    CiudadComponent,
    FormCiudadComponent,
    RangoComponent,
    FormRangoComponent,
    InstructorComponent,
    FormInstructorComponent,
    ErrorComponent,
    FormCertificacionComponent,
    CertificacionComponent,
    FormVolumenComponent,
    VolumenComponent,
    FormMaterialComponent,
    MaterialComponent,
    FormEventoComponent,
    EventoComponent,
    FormGastoComponent,
    GastoComponent,
    FormIndumentariaComponent,
    IndumentariaComponent,
    FormGaleriaComponent,
    GaleriaComponent,
    FormGimnasioComponent,
    GimnasioComponent,
    FormActividadComponent,
    ActividadComponent,
    VerInstructorComponent,
    FormCompraComponent,
    FormActividadInstructorComponent,
    FormVentaIndumentariaComponent,
    ListIndumentariaPedidoComponent,
    VerIndumentariaPedidoComponent,
    VerInscripcionCertificacionDetalleComponent,
    FormExamenComponent,
    VerPreguntasRespuestasComponent,
    ConfirmDialogComponent,
    FormPreguntasComponent,
    ConfirmDialogComponentEx,
    FormMaterialApoyoComponent,
    FormCompraActividadComponent,
    ComprasActualizacionesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FileUploadModule,
    CommonModule,
    QuillModule.forRoot({
      modules: editor_modules,
    }),

    BrowserAnimationsModule,
    NgxSpinnerModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    // CalendarModule.forRoot({
    //   provide: DateAdapter,
    //   useFactory: adapterFactory,
    // }),
    FullCalendarModule,
    NgxMatFileInputModule,
    FlatpickrModule.forRoot(),
    GoogleMapsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'es-BO',
    },
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(MatNativeDateModule),
    FormBuilder,
    AuthService,
    HttpService,
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: 'fill' },
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: 'YYYY-MM-DD',
        },
        display: {
          dateInput: 'YYYY-MM-DD',
          monthYearLabel: 'YYYY MMM',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'YYYY MMM',
        },
      },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// date
// platformBrowserDynamic().bootstrapModule(AppModule, {
//   providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
// });

//

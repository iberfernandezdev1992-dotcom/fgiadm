import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page/page-not-found/page-not-found.component';
import { LoginComponent } from './page/login/login.component';
import { CuentaComponent } from './page/cuenta/cuenta.component';
import { ClienteComponent } from './page/cliente/cliente.component';
import { ServicioComponent } from './page/servicio/servicio.component';
import { UserComponent } from './page/user/user.component';
import { CitaComponent } from './page/cita/cita.component';
import { InicioComponent } from './page/inicio/inicio.component';
import { ReportesComponent } from './page/reportes/reportes.component';
import { NoAuthGuard } from './Service/guards/noAuth.guard';
import { AuthGuard } from './Service/guards/auth.guard';
import { AdminGuard } from './Service/guards/admin.guard';
import { ClienteShowComponent } from './page/cliente-show/cliente-show.component';
import { PaisComponent } from './page/pais/pais.component';
import { CiudadComponent } from './page/ciudad/ciudad.component';
import { RangoComponent } from './page/rango/rango.component';
import { InstructorComponent } from './page/instructor/instructor.component';
import { CertificacionComponent } from './page/certificacion/certificacion.component';
import { VolumenComponent } from './page/volumen/volumen.component';
import { MaterialComponent } from './page/material/material.component';
import { EventoComponent } from './page/evento/evento.component';
import { GastoComponent } from './page/gasto/gasto.component';
import { IndumentariaComponent } from './page/indumentaria/indumentaria.component';
import { GaleriaComponent } from './page/galeria/galeria.component';
import { GimnasioComponent } from './page/gimnasio/gimnasio.component';
import { ActividadComponent } from './page/actividad/actividad.component';
import { VerInstructorComponent } from './page/ver-instructor/ver-instructor.component';
import { ShowEventComponent } from './modal/show-event/show-event.component';
import { ActividadShowComponent } from './page/actividad-show/actividad-show.component';
import { VerProgramaComponent } from './modal/ver-programa/ver-programa.component';
import { ListIndumentariaPedidoComponent } from './page/list-indumentaria-pedido/list-indumentaria-pedido.component';
import { VerPreguntasRespuestasComponent } from './page/ver-preguntas-respuestas/ver-preguntas-respuestas.component';
import { ComprasActualizacionesComponent } from './page/compras-actualizaciones/compras-actualizaciones.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full',
    canActivate: [NoAuthGuard],
  },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'pais',
    component: PaisComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'ciudad',
    component: CiudadComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'rango',
    component: RangoComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'instructor',
    component: InstructorComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'compras-actualizaciones',
    component: ComprasActualizacionesComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'instructor/:id',
    component: VerInstructorComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'verevento/:id',
    component: ShowEventComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'certificaciones',
    component: CertificacionComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'volumen',
    component: VolumenComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'material',
    component: MaterialComponent,
    // canActivate: [AuthGuard],
  },
  // {
  //   path: 'volumenmaterials/:id/:nombre',
  //   component: MaterialComponent,
  //   canActivate: [AuthGuard],
  // },
  {
    path: 'volumenmaterials',
    component: MaterialComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'evento',
    component: EventoComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'gasto',
    component: GastoComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'indumentaria',
    component: IndumentariaComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'listaindumentariapedido',
    component: ListIndumentariaPedidoComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'galeria',
    component: GaleriaComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'gimnasio',
    component: GimnasioComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'actividad',
    component: ActividadComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'cuenta',
    component: CuentaComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'usuarios',
    component: UserComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'clientes',
    component: ClienteComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cliente/:id',
    component: ClienteShowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verprograma/:id',
    component: VerProgramaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'verpreguntas/:id',
    component: VerPreguntasRespuestasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'actividad/:id',
    component: ActividadShowComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reportes',
    component: ReportesComponent,
    canActivate: [AdminGuard],
  },
  {
    path: 'servicios',
    component: ServicioComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'citas',
    component: CitaComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: '404',
    component: PageNotFoundComponent,
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

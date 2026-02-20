import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { FormActividadInstructorComponent } from 'src/app/modal/form-actividad-instructor/form-actividad-instructor.component';
import { FormActividadComponent } from 'src/app/modal/form-actividad/form-actividad.component';
import { FormCitaComponent } from 'src/app/modal/form-cita/form-cita.component';
import { FormClienteComponent } from 'src/app/modal/form-cliente/form-cliente.component';
import { FormCompraComponent } from 'src/app/modal/form-compra/form-compra.component';
import { FormServicioComponent } from 'src/app/modal/form-servicio/form-servicio.component';
import { FormVentaIndumentariaComponent } from 'src/app/modal/form-venta-indumentaria/form-venta-indumentaria.component';
import { VerDatosComponent } from 'src/app/modal/ver-datos/ver-datos.component';
import { FormGastoComponent } from '../form-gasto/form-gasto.component';
import { AuthUtils } from 'src/app/Service/auth.utils';
import { VerInscripcionCertificacionDetalleComponent } from '../ver-inscripcion-certificacion-detalle/ver-inscripcion-certificacion-detalle.component';

@Component({
  selector: 'app-show-event',
  templateUrl: './show-event.component.html',
  styleUrls: ['./show-event.component.scss'],
})
export class ShowEventComponent {
  displayedGastos: string[] = [
    'nombre',
    'monto',
    'fecha',
    'created_at',
    'accion',
  ];
  displayedCompras: string[] = [
    'imagen',
    'volumen',
    'instructor',
    'calificacion_teorico',
    'calificacion_practico',
    'calificacion_total',
    'tipo',
    'estado',
    'pagado',
    'total',
    'created_at',
    'accion',
  ];

  @ViewChild('sortGasto') sortG!: MatSort;
  dataSourceGastos: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('sortCompra') sortC!: MatSort;
  dataSourceCompras: MatTableDataSource<any> = new MatTableDataSource();

  data: any = '';
  dataId: any;
  marker: any = {};
  public readonly controladjunto = new FileUploadControl({
    listVisible: true,
    multiple: true,
  });
  isExpanded = false;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    
    // console.log(this.route.snapshot.paramMap);
    this.dataId = this.route.snapshot.paramMap.get('id');
    this.loadData();
    // this.route.queryParams.subscribe((params) => {
    //   console.log(params);
    // });
  }
  public ngOnInit(): void {
    // this.fileControl.valueChanges.subscribe((values: Array<File>) =>
    //   this.getImage(values[0])
    // );
  }
  loadData(): void {
    this.spinner.show();
    this._http.get(`eventos/${this.dataId}`).subscribe({
      next: (responser: any) => {
        console.log(responser);
        this.data = responser.data;
        this.data.lat = parseFloat(this.data.lat);
        this.data.lng = parseFloat(this.data.lng);
        this.marker = {
          position: {
            lat: this.data.lat,
            lng: this.data.lng,
          },
          label: {
            color: 'blue',
            text: 'Ubicación del evento ',
          },
          title: 'Ubicación del evento ',
          // options: { animation: google.maps.Animation.BOUNCE },
        };
        this.dataSourceCompras = new MatTableDataSource(this.data.compras);
        // this.dataSource1.paginator = this.paginator1;
        this.dataSourceCompras.sort = this.sortC;

        this.dataSourceGastos = new MatTableDataSource(this.data.gastos);
        this.dataSourceGastos.sort = this.sortG;
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }
  crearCompra(id = ''): void {
    const dialogRef = this.dialog.open(FormVentaIndumentariaComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data: '', title: 'Crear Venta', instructor: this.data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
  editardependiente(item: any): void {
    const dialogRef = this.dialog.open(FormClienteComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data: item, title: 'Editar Dependiente', cliente: this.data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
  deleteVenta(data: any) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a esta venta?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`ventas/${data.id}`).subscribe({
          next: (response) => {
            // console.log(response);
            this.spinner.hide();
            this.snackBar.open(response.mensaje, ':-)', {
              duration: 3000,
            });
            this.loadData();
          },
          error: (err) => {
            this.spinner.hide();
            this.snackBar.open(err, ':-(', {
              duration: 3000,
            });
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      }
    });
  }

  cambiarestadoc(item: any, estado: string) {
    this.spinner.show();
    const compra = {
      estado,
      _method: 'PUT',
    };
    this._http.post(`cambiarestado/${item.id}`, compra).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.snackBar.open(responser.mensaje, ':-)', {
          duration: 3000,
        });
        this.loadData();
      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }
  cambiarestado(data: any, estado: string) {
    this.spinner.show();
    const valdata = {
      id: data.id,
      cliente_id: data.cliente_id,
      start: data.start,
      end: data.end,
      etapa: data.etapa,
      estado: estado,
    };
    this._http.put(`cita/${data.id}`, valdata).subscribe({
      next: (response) => {
        // console.log(response);
        data.estado = estado;
        this.snackBar.open(response.mensaje, ':-)', {
          duration: 3000,
        });
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
  cambiarestadoVenta(data: any, estado: string) {
    this.spinner.show();
    const valdata = {
      id: data.id,
      estado: estado,
    };
    this._http.post(`ventaestado`, valdata).subscribe({
      next: (response) => {
        // console.log(response);
        data.estado = estado;
        this.snackBar.open(response.mensaje, ':-)', {
          duration: 3000,
        });
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
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }
  mayus(event: any) {
    event.value = event.value.toUpperCase();
  }

  createG(data = ''): void {
    // console.log('modal');
    const dialogRef = this.dialog.open(FormGastoComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data, evento: this.data, url: 'gastos' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }

  createC(data = ''): void {
    // console.log('modal');
    const dialogRef = this.dialog.open(FormCompraComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data, evento: this.data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }

  deleteG(data: any): void {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar este gasto?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`gastos/${data.id}`).subscribe({
          next: (response) => {
            // console.log(response);
            this.message(response.mensaje);
            this.loadData();
          },
          error: (err) => {
            this.spinner.hide();
            this.message(err);
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      }
    });
  }

  message(m: string): void {
    this.snackBar.open(m, 'Cerrar', {
      duration: 4000,
    });
  }

  ifauthenticadoAuth(rol: any = []) {
    let authval = false;
    rol.forEach((element: string) => {
      if (AuthUtils.ifRolUser(element)) {
        authval = true;
      }
    });
    return authval;
  }

  verventa(data = '') {
    // console.log('modal');
    const dialogRef = this.dialog.open(VerInscripcionCertificacionDetalleComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    //   if (result) {
    //     this.loadData();
    //   }
    // });
  }
}

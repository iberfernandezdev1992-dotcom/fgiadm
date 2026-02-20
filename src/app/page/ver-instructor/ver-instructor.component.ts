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
import { VerIndumentariaPedidoComponent } from 'src/app/modal/ver-indumentaria-pedido/ver-indumentaria-pedido.component';

@Component({
  selector: 'app-ver-instructor',
  templateUrl: './ver-instructor.component.html',
  styleUrls: ['./ver-instructor.component.scss'],
})
export class VerInstructorComponent implements OnInit {
  displayedColumns0: string[] = [
    'certificado',
    'imagen',
    'volumen',
    'tipo',
    'estado',
    'total',
    'created_at',
    'accion',
  ];
  displayedColumns1: string[] = [
    'nombre',
    'imagen',
    'precio',
    'fecha_ini',
    'fecha_fin',
    'modo',
    'tipo',
    'accion',
  ];
  displayedColumns2: string[] = ['nombre', 'imagen', 'color', 'eliminar'];
  displayedColumns3: string[] = [
    'id',
    'productos',
    'total',
    'estado',
    'descripcion',
    'created_at',
    'accion',
  ];

  @ViewChild('sort0') sort0!: MatSort;
  dataSource0: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('sort1') sort1!: MatSort;
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();

  // @ViewChild('sortabjunto') sort2!: MatSort;
  dataSource2: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('sortdependientes') sort3!: MatSort;
  dataSource3: MatTableDataSource<any> = new MatTableDataSource();

  dataForm!: FormGroup;
  data: any = '';
  clienteId: any;
  public fileControl!: FormControl;
  imagenG: any;
  image: any;
  public readonly controladjunto = new FileUploadControl({
    listVisible: true,
    multiple: true,
  });
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    this.fileControl = new FormControl();
    // console.log(this.route.snapshot.paramMap);
    this.clienteId = this.route.snapshot.paramMap.get('id');
    this.loadData();
    // this.route.queryParams.subscribe((params) => {
    //   console.log(params);
    // });
  }
  public ngOnInit(): void {
    // this.fileControl.valueChanges.subscribe((values: Array<File>) =>
    //   this.getImage(values[0])
    // );
    this.fileControl.valueChanges.subscribe((file: File) => {
      this.imagenG = file;
      var myReader: FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent: any) {
        // image.src = loadEvent.target.result;
        that.image = loadEvent.target.result;
      };
      myReader.readAsDataURL(file);
    });
  }
  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.id],
      informacion_preliminar: [
        this.data.informacion_preliminar,
        Validators.compose([Validators.required]),
      ],
      nombres: [
        this.data.nombres,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      apellidos: [
        this.data.apellidos,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      fecha_nacimiento: [
        this.data.fecha_nacimiento,
        Validators.compose([Validators.required]),
      ],
      ci: [this.data.ci, Validators.compose([Validators.required])],
      celular: [this.data.celular, Validators.compose([Validators.required])],
      pasaporte: [this.data.pasaporte],
      cn: [this.data.cn],
      direccion: [this.data.direccion],
      email: [this.data.email, Validators.compose([Validators.email])],
      user_id: [
        this.data.user_id ? parseInt(this.data.user_id) : '',
        Validators.compose([Validators.required]),
      ],
    });
  }
  loadData(): void {
    this.spinner.show();
    this._http.get(`instructor/${this.clienteId}`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.data = responser.data;
        this.image = this.data.fotografia;
        this.dataForm = this.createForm();
        // console.log(this.data.citas);

        this.dataSource1 = new MatTableDataSource(this.data.actividades);
        // this.dataSource1.paginator = this.paginator1;
        this.dataSource1.sort = this.sort1;

        this.dataSource2 = new MatTableDataSource(this.data.certificacions);
        // this.dataSource2.paginator = this.paginatorabjunto;
        // this.dataSource2.sort = this.sort2;

        this.dataSource3 = new MatTableDataSource(this.data.ventas);
        // this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;

        this.dataSource0 = new MatTableDataSource(this.data.compras);
        // this.dataSourceventas.paginator = this.paginatorventas;
        this.dataSource0.sort = this.sort0;
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
  guardar() {
    const data1 = this.dataForm.value;
    // console.log(data1);
    const formData = new FormData();
    if (this.imagenG) {
      formData.append('fotografia', this.imagenG);
    }
    formData.append('id', data1.id ? data1.id : '');
    formData.append('user_id', data1.user_id ? data1.user_id : '');
    formData.append(
      'informacion_preliminar',
      data1.informacion_preliminar ? data1.informacion_preliminar : ''
    );
    formData.append('nombres', data1.nombres ? data1.nombres : '');
    formData.append('apellidos', data1.apellidos ? data1.apellidos : '');
    formData.append(
      'fecha_nacimiento',
      data1.fecha_nacimiento
        ? moment(data1.fecha_nacimiento).format('YYYY-MM-DD')
        : ''
    );
    formData.append('ci', data1.ci ? data1.ci : '');
    formData.append('celular', data1.celular ? data1.celular : '');
    formData.append('pasaporte', data1.pasaporte ? data1.pasaporte : '');
    formData.append('cn', data1.cn ? data1.cn : '');
    formData.append('direccion', data1.direccion ? data1.direccion : '');
    formData.append('email', data1.email ? data1.email : '');
    // console.log(formData);
    formData.append('_method', 'PUT');
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title:
          '¿Estás seguro de que deseas actualizar la información del cliente?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.post(`cliente/${data1.id}`, formData, headers).subscribe({
          next: (response) => {
            // console.log(response);
            this.loadData();
            this.spinner.hide();
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
    });
  }
  verVenta(data: any) {
    console.log(data);
  }
  createVentaIndumentaria(): void {
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
  guardarAdjuntos() {
    if (this.controladjunto.value.length > 0) {
      this.controladjunto.value.forEach(async (data) => {
        this.spinner.show();
        const formData = new FormData();
        const filedata = data as File;
        formData.append('cliente_id', this.data.id);
        formData.append('adjunto', filedata);
        await this._http.post('adjunto', formData).subscribe({
          next: (response) => {
            // console.log(response);
            this.spinner.hide();
            this.snackBar.open(response.mensaje, ':-)', {
              duration: 3000,
            });
            this.loadData();
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
      });
      this.controladjunto.clear();
    }
  }
  eliminarInteres(data: any): void {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a este curso de interés?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`cursosinteres/${data.pivot.id}`).subscribe({
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

  addactividad(dataval = '') {
    const dialogRef = this.dialog.open(FormActividadInstructorComponent, {
      // width: '90vw',
      // maxWidth: '90vw',
      // height: '80vh',
      // minHeight: '88vh',
      disableClose: true,
      data: { instructor: this.data, data: dataval },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
  deletecitas(item: any) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a esta Cita?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`cita/${item.id}`).subscribe({
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
    });
  }
  addservicio() {
    const dialogRef = this.dialog.open(FormCompraComponent, {
      // width: '90vw',
      // maxWidth: '90vw',
      // minHeight: '88vh',
      disableClose: true,
      data: { instructor: this.data, data: '' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        // setTimeout(() => {
        //   this.verventa(result);
        // }, 500);
      }
    });
  }
  verventa(data: any) {
    const dialogRef = this.dialog.open(VerIndumentariaPedidoComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data },
    });
    // const dialogRef = this.dialog.open(VerDatosComponent, {
    //   // width: '100vw',
    //   disableClose: true,
    //   data: {
    //     data,
    //     cliente: {
    //       nombre: this.data.nombres,
    //       apellidos: this.data.apellidos,
    //       ci: this.data.ci,
    //       celular: this.data.celular,
    //     },
    //     vista: 'Venta',
    //   },
    // });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result) {
    //     this.loadData();
    //   }
    // });
  }
  deletec(item: any) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`compras/${item.id}`).subscribe({
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
    });
  }
  // cambiarestadoc(item: any, estado: string) {
  //   this.spinner.show();
  //   const compra = {
  //     estado,
  //     _method: 'PUT',
  //   };
  //   this._http.post(`compras/${item.id}`, compra).subscribe({
  //     next: (responser: any) => {
  //       // console.log(responser);
  //       this.snackBar.open(responser.mensaje, ':-)', {
  //         duration: 3000,
  //       });
  //       this.loadData();
  //     },
  //     error: (err) => {
  //       this.spinner.hide();
  //       console.log(err);
  //     },
  //     complete: () => {
  //       this.spinner.hide();
  //     },
  //   });
  // }
  cambiarestadoc(item: any, estado: string) {
    this.spinner.show();
    const compra = {
      estado
    };

    // Cambiar la URL para que apunte al nuevo endpoint
    this._http.put(`compras/${item.id}/estado`, compra).subscribe({
      next: (response: any) => {
        this.snackBar.open(response.mensaje, ':-)', {
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
}

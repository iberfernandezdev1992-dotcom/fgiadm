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
import { FormCitaComponent } from 'src/app/modal/form-cita/form-cita.component';
import { FormClienteComponent } from 'src/app/modal/form-cliente/form-cliente.component';
import { FormServicioComponent } from 'src/app/modal/form-servicio/form-servicio.component';
import { VerDatosComponent } from 'src/app/modal/ver-datos/ver-datos.component';

@Component({
  selector: 'app-cliente-show',
  templateUrl: './cliente-show.component.html',
  styleUrls: ['./cliente-show.component.scss'],
})
export class ClienteShowComponent implements OnInit {
  displayedColumns1: string[] = [
    'etapa',
    'estado',
    'start',
    'end',
    'resumen',
    'accion',
  ];
  displayedColumns2: string[] = ['nombre', 'descarga', 'eliminar'];
  displayedColumns3: string[] = [
    'imagen',
    'nombres',
    'ci',
    'celular',
    'parentesco',
    'accion',
  ];
  displayedColumnsventas: string[] = [
    'servicios',
    'monto',
    'descuento',
    'total',
    'pagado',
    'saldo',
    'estado',
    'created_at',
    'accion',
  ];
  @ViewChild('sortcitas') sort1!: MatSort;
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();

  // @ViewChild('sortabjunto') sort2!: MatSort;
  dataSource2: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('sortdependientes') sort3!: MatSort;
  dataSource3: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('sortventas') sortventas!: MatSort;
  dataSourceventas: MatTableDataSource<any> = new MatTableDataSource();
  dataForm!: FormGroup;
  data: any = '';
  clienteId: any;
  responsables: Array<any> = [];
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
    this.loadResponsable();
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
    this._http.get(`cliente/${this.clienteId}`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.data = responser.data;
        this.image = this.data.fotografia;
        this.dataForm = this.createForm();
        // console.log(this.data.citas);

        this.dataSource1 = new MatTableDataSource(this.data.citas);
        // this.dataSource1.paginator = this.paginator1;
        this.dataSource1.sort = this.sort1;

        this.dataSource2 = new MatTableDataSource(this.data.adjuntos);
        // this.dataSource2.paginator = this.paginatorabjunto;
        // this.dataSource2.sort = this.sort2;

        this.dataSource3 = new MatTableDataSource(this.data.dependientes);
        // this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;

        this.dataSourceventas = new MatTableDataSource(this.data.ventas);
        // this.dataSourceventas.paginator = this.paginatorventas;
        this.dataSourceventas.sort = this.sortventas;
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
  public loadResponsable(): void {
    this._http.get(`user`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.responsables = responser.data;
        // if (!this.data) {
        //   this.dataForm.patchValue({ user_id: this.userId });
        // }
        // this.dataForm.controls['user_id'].setValue('1');
      },
      error: (err: any) => {
        console.log(err);
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
  create(): void {
    const dialogRef = this.dialog.open(FormClienteComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data: '', title: 'Crear Dependiente', cliente: this.data },
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
  deletedependiente(data: any) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a este dependiente?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`cliente/${data.id}`).subscribe({
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
  eliminarAdjunto(data: any): void {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a este documento?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`adjunto/${data.id}`).subscribe({
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

  addcitas(cita = '') {
    const dialogRef = this.dialog.open(FormCitaComponent, {
      width: '90vw',
      maxWidth: '90vw',
      // height: '80vh',
      minHeight: '88vh',
      disableClose: true,
      data: { data: this.data, cita },
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
  addservicio(servicio = '') {
    const dialogRef = this.dialog.open(FormServicioComponent, {
      // width: '90vw',
      // maxWidth: '90vw',
      // minHeight: '88vh',
      disableClose: true,
      data: { data: this.data, servicio },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
        setTimeout(() => {
          this.verventa(result);
        }, 500);
      }
    });
  }
  verventa(data: any) {
    const dialogRef = this.dialog.open(VerDatosComponent, {
      // width: '100vw',
      disableClose: true,
      data: {
        data,
        cliente: {
          nombre: this.data.nombres,
          apellidos: this.data.apellidos,
          ci: this.data.ci,
          celular: this.data.celular,
        },
        vista: 'Venta',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }
  deleteventa(item: any) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a esta Venta?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`venta/${item.id}`).subscribe({
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
  cambiarestadoVenta(item: any, estado: string) {
    this.spinner.show();
    const venta = {
      estado,
    };
    this._http.put(`venta/${item.id}`, venta).subscribe({
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
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }
  mayus(event: any) {
    event.value = event.value.toUpperCase();
  }
}

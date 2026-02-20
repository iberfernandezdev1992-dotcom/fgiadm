import {
  Component,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnInit,
  Inject,
} from '@angular/core';

import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { FormClienteComponent } from 'src/app/modal/form-cliente/form-cliente.component';
import { HttpParams } from '@angular/common/http';
import { FormCitaComponent } from 'src/app/modal/form-cita/form-cita.component';
import { Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { FormServicioComponent } from 'src/app/modal/form-servicio/form-servicio.component';
import { VerDatosComponent } from 'src/app/modal/ver-datos/ver-datos.component';
@Component({
  selector: 'app-cliente-view',
  templateUrl: './cliente-view.component.html',
  styleUrls: ['./cliente-view.component.scss'],
})
export class ClienteViewComponent implements AfterViewInit, OnInit {
  // citas
  displayedColumns1: string[] = ['etapa', 'estado', 'start', 'end', 'accion'];
  displayedColumns2: string[] = ['nombre', 'descarga', 'eliminar'];
  displayedColumns3: string[] = [
    'imagen',
    'nombre',
    'ci',
    'celular',
    'email',
    'accion',
  ];
  displayedColumnsventas: string[] = [
    'servicios',
    'monto',
    'descuento',
    'total',
    'estado',
    'created_at',
    'accion',
  ];

  // dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild('pagecitas') paginator1!: MatPaginator; // Utiliza '!' para indicar que está inicializada
  @ViewChild('sortcitas') sort1!: MatSort;
  dataSource1: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('pageadjunto') paginatorabjunto!: MatPaginator; // Utiliza '!' para indicar que está inicializada
  @ViewChild('sortabjunto') sort2!: MatSort;
  dataSource2: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('pagedependientes') paginator3!: MatPaginator; // Utiliza '!' para indicar que está inicializada
  @ViewChild('sortdependientes') sort3!: MatSort;
  dataSource3: MatTableDataSource<any> = new MatTableDataSource();

  @ViewChild('pageventas') paginatorventas!: MatPaginator; // Utiliza '!' para indicar que está inicializada
  @ViewChild('sortventas') sortventas!: MatSort;
  dataSourceventas: MatTableDataSource<any> = new MatTableDataSource();
  //
  // @ViewChildren(MatPaginator) paginators!: QueryList<MatPaginator>;

  dialogTitle: string = 'Crear Usuario';
  data: any = '';
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  private subscription: Subscription | any;
  hide = true;
  public readonly control = new FileUploadControl(
    {
      listVisible: true,
      accept: ['image/*'],
      discardInvalid: true,
      multiple: false,
    },
    [
      FileUploadValidators.accept(['image/*']),
      FileUploadValidators.filesLimit(1),
    ]
  );
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<ClienteViewComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    // console.log(this._data);

    this.loadData();
  }
  ngAfterViewInit() {
    // this.picker.selectedChange.subscribe(
    //   (newDate: Moment) => {
    //     this.isValidMoment = moment.isMoment(newDate);
    //   },
    //   (error: any) => {
    //     throw Error(error);
    //   }
    // );
  }
  public ngOnInit(): void {
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private getImage(file: File): void {
    if (FileReader && file) {
      const fr = new FileReader();
      fr.onload = (e: any) => this.uploadedFile.next(e.target.result);
      fr.readAsDataURL(file);
    } else {
      this.uploadedFile.next('');
    }
  }
  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.id],
      nombre: [
        this.data.nombre,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      email: [
        this.data.email,
        Validators.compose([Validators.required, Validators.email]),
      ],
      celular: [this.data.celular, Validators.compose([Validators.required])],
      rol: [this.data.rol, Validators.compose([Validators.required])],
      fecha_nacimiento: [this.data.fecha_nacimiento],
      ci: [this.data.ci, Validators.compose([Validators.required])],
      password: ['', this.data ?? Validators.compose([Validators.required])],
    });
  }

  loadData(): void {
    this.spinner.show();
    this._http.get(`cliente/${this._data.data.id}`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.data = responser.data;
        // console.log(this.data.citas);

        this.dataSource1 = new MatTableDataSource(this.data.citas);
        this.dataSource1.paginator = this.paginator1;
        this.dataSource1.sort = this.sort1;

        this.dataSource2 = new MatTableDataSource(this.data.adjuntos);
        this.dataSource2.paginator = this.paginatorabjunto;
        this.dataSource2.sort = this.sort2;

        this.dataSource3 = new MatTableDataSource(this.data.dependientes);
        this.dataSource3.paginator = this.paginator3;
        this.dataSource3.sort = this.sort3;

        this.dataSourceventas = new MatTableDataSource(this.data.ventas);
        this.dataSourceventas.paginator = this.paginatorventas;
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
  verventa(data: any) {
    const dialogRef = this.dialog.open(VerDatosComponent, {
      // width: '100vw',
      // disableClose: true,
      data: { data, vista: 'Venta' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
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
  addcitas(cita = '') {
    const dialogRef = this.dialog.open(FormCitaComponent, {
      width: '90vw',
      maxWidth: '90vw',
      // minHeight: '88vh',
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
            this.message(responser.mensaje);
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
            this.message(responser.mensaje);
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
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }
  eliminarAdjunto(item: any) {}
  onNoClick(): void {
    this.dialogRef.close();
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }
  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource2.filter = filterValue.trim().toLowerCase();

    if (this.dataSource2.paginator) {
      this.dataSource2.paginator.firstPage();
    }
  }
  applyFilter3(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource3.filter = filterValue.trim().toLowerCase();

    if (this.dataSource3.paginator) {
      this.dataSource3.paginator.firstPage();
    }
  }
  applyFilterventas(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceventas.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceventas.paginator) {
      this.dataSourceventas.paginator.firstPage();
    }
  }
  message(m: string): void {
    this.snackBar.open(m, 'Cerrar', {
      duration: 4000,
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
        this.message(responser.mensaje);
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
}

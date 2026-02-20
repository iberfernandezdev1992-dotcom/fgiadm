import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  map,
} from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';

@Component({
  selector: 'app-form-servicio',
  templateUrl: './form-servicio.component.html',
  styleUrls: ['./form-servicio.component.scss'],
})
export class FormServicioComponent implements AfterViewInit, OnInit {
  @ViewChild('monto', { static: true }) monto!: ElementRef;
  dataSourceservicios: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsserv: string[] = ['detalle', 'costo', 'cantidad', 'subtotal'];
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Servicio';
  data: any = '';
  detalle: Array<any> = [];
  tipos: Array<any> = [];
  tipo = '';
  servicios: Array<any> = [];
  cliente: any;
  hide = true;
  descuento = '';
  estado = 'En curso';
  pago: any = {
    metodo_pago: 'Efectivo',
    monto: '',
    fecha: new Date(),
    // numero_recibo: '',
  };

  constructor(
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormServicioComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.cliente = _data.data;
    this.data = _data.servicio;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Servicio';
    }
    this.dataForm = this.createForm();
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
    this.getservicios();
    fromEvent(this.monto.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: number) => {
        if (text > this.caltotal()) {
          this.pago.monto = '';
          this.snackBar.open(
            'El monto no tiene que ser mayor al total de la venta',
            ':-(',
            {
              duration: 3000,
            }
          );
        }
      });
    // this.subscription = this.control.valueChanges.subscribe(
    //   (values: Array<File>) => this.getImage(values[0])
    // );
  }

  getservicios() {
    this.spinner.show();
    this._http.get(`servicio`).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.servicios = response.data;
        this.tipos = response.tipo;
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

  public ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.id],
      cliente_id: [this.cliente.id, Validators.compose([Validators.required])],
      monto: [this.data.monto, Validators.compose([Validators.required])],
      descuento: [this.data.descuento],
      descripcion: [
        this.data.descripcion,
        Validators.compose([Validators.required]),
      ],
      estado: [this.data.estado, Validators.compose([Validators.required])],
    });
  }
  agregarservicio(item: any) {
    // console.log(item);
    if (item.value) {
      const index = this.detalle.findIndex((val) => val.id == item.value.id);
      if (index >= 0) {
        this.detalle[index].cantidad += 1;
      } else {
        const data = { ...item.value };
        this.detalle.push(data);
      }
    }
    this.dataSourceservicios = new MatTableDataSource(this.detalle);
    // new datasource
    // if (item.value) {
    //   const index = this.dataSourceservicios.data.findIndex(
    //     (val) => val.id == item.value.id
    //   );
    //   if (index >= 0) {
    //     this.dataSourceservicios.data[index].cantidad += 1;
    //   } else {
    //     const data = { ...item.value };
    //     this.dataSourceservicios.data.push(data);
    //   }
    //   this.cdr.detectChanges();
    // }
  }
  caltotal() {
    let total = 0;
    this.detalle.forEach((element) => {
      total += element.cantidad * element.precio_base;
    });
    if (this.descuento) {
      return total - parseFloat(this.descuento);
    }
    return total;
  }
  removeserv(index: number) {
    this.detalle.splice(index, 1);
    this.dataSourceservicios = new MatTableDataSource(this.detalle);
  }
  guardar() {
    this.spinner.show();
    this.pago.fecha = this.pago.fecha
      ? moment(this.pago.fecha).format('YYYY-MM-DD hh:mm:ss')
      : '';
    const data1 = {
      descuento: this.descuento ? this.descuento : 0,
      cliente_id: this.cliente.id,
      detalle: this.detalle,
      pago: this.pago,
      estado: this.estado,
    };
    // console.log(data1);

    // if (!data1.id) {
    this._http.post('venta', data1).subscribe({
      next: (response) => {
        // console.log(response);
        // this.cargar();
        // console.log(response);
        // this.spinner.hide();
        // this.cancelar();
        this.snackBar.open(response.mensaje, ':-)', {
          duration: 3000,
        });
        this.dialogRef.close(response.data);
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
    // } else {
    //   this._http.put(`user/${data1.id}`, data1).subscribe({
    //     next: (response) => {
    //       console.log(response);
    //       // this.cargar();
    //       // console.log(response);
    //       // this.spinner.hide();
    //       // this.cancelar();
    //       this.snackBar.open(response.mensaje, ':-)', {
    //         duration: 3000,
    //       });
    //       this.dialogRef.close(true);
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
  }
  serviciosval(): Array<any> {
    if (this.tipo) {
      return this.servicios.filter((val) => val.tipo == this.tipo);
    } else {
      return this.servicios;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }

  calcularsubtotal(): number {
    return this.dataSourceservicios.data
      .map((t: any) => t.precio_base * t.cantidad)
      .reduce((acc, value) => acc + value, 0);
  }
  calcularsubtotalneto(): any {
    if (this.descuento) {
      return (
        parseFloat(this.calcularsubtotal().toString()) -
        parseFloat(this.descuento)
      );
    } else {
      return this.calcularsubtotal().toString();
    }
  }
}

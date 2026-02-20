import { HttpHeaders, HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  debounceTime,
  distinctUntilChanged,
  fromEvent,
  Subscription,
  map,
  switchMap,
  tap,
  finalize,
} from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';

@Component({
  selector: 'app-form-venta-indumentaria',
  templateUrl: './form-venta-indumentaria.component.html',
  styleUrls: ['./form-venta-indumentaria.component.scss'],
})
export class FormVentaIndumentariaComponent {
  // @ViewChild('search', { static: true }) search: ElementRef | any;
  searchDataCtrl = new FormControl();
  dataSourceservicios: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsserv: string[] = ['detalle', 'costo', 'cantidad', 'subtotal'];
  dataForm: FormGroup;
  isLoadingData = false;
  filteredData: any;
  dialogTitle: string = 'Vender Indumentaria';
  data: any = '';
  estado: string = 'entregado';
  descripcion: string = '';
  descuento = '';
  certificacion: any = '';
  certificaciones: Array<any> = [];
  actividades: Array<any> = [];
  detalle: Array<any> = [];
  instructor: any = '';
  userDatos: any = [];
  indumentariasData: any = [];
  private subscription: Subscription | any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormVentaIndumentariaComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.instructor = _data.instructor;
    this.data = _data.data;
    if (this.data.id) {
      this.userDatos = JSON.parse(this.data.pivot.user_datos);
      this.dialogTitle = 'Actualizar venta indumentaria';
    }
    this.dataForm = this.createForm();
  }

  public ngOnInit(): void {
    this.searchDataCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          // this.errorMsg = '';
          this.filteredData = [];
          this.isLoadingData = true;
        }),
        switchMap((value: any) => {
          const filterdata = {
            page: 1,
            limit: 25,
            column: 'nombre',
            order: 'asc',
            search: value,
            certificacion_id: this.certificacion ? this.certificacion.id : '',
          };

          if (!value) {
            delete filterdata.search;
          }
          const params = new HttpParams({
            fromObject: filterdata,
            // encoder: new HttpUrlEncodingCodec(),
          });
          return this._http.get('indumentarias', params).pipe(
            finalize(() => {
              this.isLoadingData = false;
            })
          );
        })
      )
      .subscribe((data: any) => {
        if (!data.data.data.length) {
          // this.errorMsg = data['Error'];
          this.filteredData = [];
        } else {
          // this.errorMsg = '';
          this.filteredData = data.data.data;
        }
      });
    // end select
    this.loadcertificacions();
  }
  displayWith(value: any): string {
    return value?.nombre;
  }
  onSelected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value);
    this.agregarservicio(event.option);
    this.searchDataCtrl.patchValue('');
    // this.paginator.pageIndex = 0;
    // if (event.option.value) {
    //   this.filtertable.certificacion_if = event.option.value.id;
    // }
    // this.loadData();
  }
  clearSelection(): void {
    this.searchDataCtrl.patchValue('');
    // this.loadData();
  }
  // loadData(): void {
  //   this.spinner.show();
  //   this._http.get(`indumentariasdata`).subscribe({
  //     next: (responser: any) => {
  //       console.log(responser);
  //       this.indumentariasData = responser.data;
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

  public loadcertificacions(): void {
    this._http.get(`certificacionesActividades`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.certificaciones = responser.data;
        if (this.data) {
          let index = this.certificaciones.findIndex(
            (val) => val.id == this.data.certificacion_id
          );
          this.dataForm.patchValue({
            certificacion_id: this.certificaciones[index],
          });
          this.actividades = this.certificaciones[index].actividades;

          this.dataForm.patchValue({
            actividad_id: this.data.pivot.actividad_id,
          });
        }

        // if (!this.data) {
        //   this.dataForm.patchValue({ pai_id: this.userId });
        // }
        // this.dataForm.controls['user_id'].setValue('1');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  // public loadactividades(data: any): void {
  //   console.log(data);
  //   this.actividades = data.actividades;
  //   // this._http.get(`actividadesdata/${id}`).subscribe({
  //   //   next: (responser: any) => {
  //   //     // console.log(responser);
  //   //     this.actividades = responser.data;
  //   //     // if (!this.data) {
  //   //     //   this.dataForm.patchValue({ pai_id: this.userId });
  //   //     // }
  //   //     // this.dataForm.controls['user_id'].setValue('1');
  //   //   },
  //   //   error: (err: any) => {
  //   //     console.log(err);
  //   //   },
  //   // });
  // }

  addUsda() {
    this.userDatos.push({ key: '', valor: '' });
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.id],
      instructor_id: [
        this.instructor.id,
        Validators.compose([Validators.required]),
      ],
      total: [this.data.total, Validators.compose([Validators.required])],
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
    let detalle = this.dataSourceservicios.data;
    if (item.value) {
      const index = detalle.findIndex(
        (val) => val.indumentaria_id == item.value.id
      );
      if (index >= 0) {
        detalle[index].cantidad += 1;
        detalle[index].total = detalle[index].precio * detalle[index].cantidad;
      } else {
        // const data = { ...item.value };
        const data = {
          indumentaria_id: item.value.id,
          precio: item.value.precio,
          cantidad: 1,
          total: item.value.precio,
          indumentaria: item.value,
        };
        detalle.push(data);
      }
    }
    console.log(detalle);

    this.dataSourceservicios = new MatTableDataSource(detalle);
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
  // caltotal() {
  //   let total = 0;
  //   this.detalle.forEach((element) => {
  //     total += element.cantidad * element.precio_base;
  //   });
  //   if (this.descuento) {
  //     return total - parseFloat(this.descuento);
  //   }
  //   return total;
  // }
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }
  calcularrowitem(item: any) {
    item.total = item.precio * item.cantidad;
  }
  calcularsubtotal(): number {
    return this.dataSourceservicios.data
      .map((t: any) => t.precio * t.cantidad)
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
  removeserv(index: number) {
    let detalle = this.dataSourceservicios.data;
    detalle.splice(index, 1);
    this.dataSourceservicios = new MatTableDataSource(detalle);
  }
  guardar() {
    // console.log(this.detalle);
    // let detalleval = this.dataSourceservicios.data;

    this.spinner.show();
    // this.pago.fecha = this.pago.fecha
    //   ? moment(this.pago.fecha).format('YYYY-MM-DD hh:mm:ss')
    //   : '';
    const data1 = {
      // descuento: this.descuento ? this.descuento : 0,
      instructor_id: this.instructor.id,
      detalle: this.dataSourceservicios.data,
      descripcion: this.descripcion,
      estado: this.estado,
    };
    // console.log(data1);

    // if (!data1.id) {
    this._http.post('ventas', data1).subscribe({
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

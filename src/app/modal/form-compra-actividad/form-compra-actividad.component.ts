import { HttpParams } from '@angular/common/http';
import {
  Component,
  AfterViewInit,
  OnInit,
  Inject,
  ElementRef,
  ViewChild,
  ChangeDetectorRef,
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
  Subscription,
  debounceTime,
  distinctUntilChanged,
  finalize,
  fromEvent,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';

@Component({
  selector: 'app-form-compra-actividad',
  templateUrl: './form-compra-actividad.component.html',
  styleUrls: ['./form-compra-actividad.component.scss']
})
export class FormCompraActividadComponent {
@ViewChild('monto', { static: true }) monto!: ElementRef;
  dataSourceservicios: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumnsserv: string[] = ['detalle', 'costo', 'cantidad', 'subtotal'];
  dataForm: FormGroup;
  dialogTitle: string = 'Compra de Volumen';
  data: any = '';
  certificacions: Array<any> = [];
  volumens: Array<any> = [];
  volumen = '';
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
  filteredData: any;
  searchDataCtrl = new FormControl();
  isLoadingData = false;
  evento: any = {};
  public fileControl: FormControl;
  imagenG: any;
  image: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormCompraActividadComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.cliente = _data.instructor;
    this.evento = _data.evento;
    this.data = _data.data;
    console.log(this.data);
    console.log("Evento",this.evento);
    
    if (this.data?.id) {
      this.dialogTitle = 'Actualizar Compra';
      this.cliente = this.data.instructor;
      this.image = this.data.imagen;
      // this.searchDataCtrl.patchValue(this.cliente.primer_nombre);
      // setTimeout(() => {
      //   this.searchDataCtrl.patchValue(this.cliente);
      // }, 1500);
    }
    this.dataForm = this.createForm();
    this.fileControl = new FormControl();
    console.log(this.dataForm.value);
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
    console.log(this.evento);

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

    this.getcertificados();
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
            column: 'primer_nombre',
            order: 'asc',
            search: value,
          };

          if (!value) {
            delete filterdata.search;
          }
          const params = new HttpParams({
            fromObject: filterdata,
            // encoder: new HttpUrlEncodingCodec(),
          });
          return this._http.get('instructor', params).pipe(
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
  }
  onSelected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value);
    this.cliente = event.option.value;
  }
  displayWith(value: any): string {
    console.log(value);

    return value ? value?.primer_nombre : '';
  }
  clearSelection(): void {
    this.searchDataCtrl.patchValue('');
    // this.loadData();
  }
  getcertificados() {
    this.spinner.show();
    this._http.get(`certificacionesdata`).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.certificacions = response.data;
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
  selectcert(cert: any) {
    console.log(cert.value);
    if (cert.value) {
      this.volumens = cert.value.volumens;
    }
  }

  selectvol(vol: any) {
    console.log(vol.value);
    if (vol.value) {
      this.dataForm.patchValue({
        total: vol.value?.precio,
      });
      // this.volumens = vol.value;
    }
  }

  public ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.id],
      // volumen: [
      //   this.evento ? this.evento.certificacion_id : this.data.certificacion,
      //   Validators.compose([Validators.required]),
      // ],
      // instructor_id: [
      //   this.cliente.id,
      //   Validators.compose([Validators.required]),
      // ],
      tipo: [this.data.tipo, Validators.compose([Validators.required])],
      estado: [this.data.estado],
      total: [this.data.total],
      
      forma_pago: [
        this.data.pagos && this.data.pagos.length
          ? this.data.pagos[0].forma_pago
          : 'Efectivo',
      ],
      monto: [
        this.data && this.data.pagos.length ? this.data.pagos[0].monto : '',
      ],
      
    });

    
    
  }
  guardar() {
    const data1 = this.dataForm.value;
    const formData = new FormData();

    // // Convertir calificaciones a número si existen, o asignar 0 si no están definidas
    // const calificacionPractico = data1.calificacion_practico ? parseFloat(data1.calificacion_practico) : null;
    // const calificacionTeorico = data1.calificacion_teorico ? parseFloat(data1.calificacion_teorico) : null;

    // // Verificar si ambas calificaciones están presentes antes de sumarlas
    // if (calificacionPractico !== null && calificacionTeorico !== null) {
    //     // Sumar las calificaciones teórico y práctico
    //     const sumaCalificaciones = calificacionPractico + calificacionTeorico;
    //     data1.calificacion_total = sumaCalificaciones; // Guardamos la suma en calificacion_total

    //     // Verificar si la suma es mayor a 80, y si es así, cambiar el estado a 'Aprobado'
    //     data1.estado = sumaCalificaciones > 80 ? 'aprobado' : 'reprobado';
    //     if (sumaCalificaciones >= 80) {
    //       formData.append('calificacion_estado_examen', "aprobado");
    //     } else{
    //       formData.append('calificacion_estado_examen', "reprobado");

    //     }

    // } else {
    //     // Si falta alguna calificación, no cambiar el estado
    //     data1.estado = data1.estado || ''; 
    //     data1.calificacion_total = ''; // Si falta una nota, enviamos vacío
    // }

    // Procesar los demás campos y agregarlos al FormData
    if (this.evento) {
        formData.append('actividad_id', this.evento.id);
        formData.append('certificacion_id', this.evento.certificacion_id);
    } else {
        formData.append('certificacion_id', data1.certificacion ? data1.certificacion.id : '');
    }

    formData.append('instructor_id', this.cliente.id);
    formData.append('tipo', data1.tipo ? data1.tipo : '');
    formData.append('estado', data1.estado); // Enviar el estado final
    formData.append('total', data1.total ? data1.total : '');
    formData.append('forma_pago', data1.forma_pago ? data1.forma_pago : '');
    formData.append('monto', data1.monto ? data1.monto : '');

    // Enviar las calificaciones incluyendo la suma total
    if (this.imagenG) {
        formData.append('imagen', this.imagenG);
    }

    this.spinner.show();
    if (!data1.id) {
        this._http.post('compra-taller', formData).subscribe({
            next: (response) => {
                this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
                this.dialogRef.close(response);
            },
            error: (error) => {
                console.log("eerrorsaso", error);
                this.spinner.hide();
                const errorMessage = error.error?.error || 'Error desconocido';
                this.snackBar.open(errorMessage, ':-(', { duration: 3000 });
            },
            complete: () => {
                this.spinner.hide();
            },
        });
    } else {
        formData.append('_method', 'PUT');
        this._http.post(`compras/${data1.id}`, formData).subscribe({
            next: (response) => {
                console.log(response);
                this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
                this.dialogRef.close(true);
            },
            error: (error) => {
                console.log("eerrorsaso", error);
                this.spinner.hide();
                const errorMessage = error.error?.error || 'Error desconocido';
                this.snackBar.open(errorMessage, ':-(', { duration: 3000 });
            },
            complete: () => {
                this.spinner.hide();
            },
        });
    }
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

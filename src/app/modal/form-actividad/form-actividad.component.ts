import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
  finalize,
} from 'rxjs/operators';
import { HttpService } from 'src/app/Service/http.service';
import { GoogleMap } from '@angular/google-maps';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AuthUtils } from 'src/app/Service/auth.utils';

@Component({
  selector: 'app-form-actividad',
  templateUrl: './form-actividad.component.html',
  styleUrls: ['./form-actividad.component.scss'],
})
export class FormActividadComponent implements OnInit {
  imagen: any;
  banner: any;
  img_qr: any;

  dataForm: FormGroup;
  dialogTitle: string = 'Crear Actividad';
  data: any = '';
  certificaciones: Array<any> = [];

  lat: number = 40.73061;
  lng: number = -73.935242;
  zoom = 12;

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  private subscription: Subscription | any;

  searchDataCtrl = new FormControl();
  filteredData: any[] = [];
  isLoadingData: boolean = false;
  gimnasio: any;
  ciuadads: any;
  paises: any;
  user: any;

  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormActividadComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    let user = localStorage.getItem('user') ?? '';
    this.user = JSON.parse(user);
    this.data = _data.data;
    console.log("editar", this.data);

    if (this.data?.id) {
      this.dialogTitle = 'Actualizar Actividad';
      this.imagen = this.data.imagen;
      this.banner = this.data.banner;
      this.img_qr = this.data.img_qr;
      this.gimnasio = this.data.gimnasio;

      if (this.gimnasio?.nombre) {
        this.searchDataCtrl.setValue(this.gimnasio);
      }
    }

    if (
      this.data?.lat &&
      this.data?.lng &&
      !isNaN(parseFloat(this.data.lat)) &&
      !isNaN(parseFloat(this.data.lng))
    ) {
      this.lat = parseFloat(this.data.lat);
      this.lng = parseFloat(this.data.lng);
      this.zoom = 18;
    }

    this.dataForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadcertificacions();

    this.dataForm.get('imagen')?.valueChanges.subscribe((file: File) => {
      const reader = new FileReader();
      reader.onloadend = (event: any) => (this.imagen = event.target.result);
      reader.readAsDataURL(file);
    });

    this.dataForm.get('banner')?.valueChanges.subscribe((file: File) => {
      const reader = new FileReader();
      reader.onloadend = (event: any) => (this.banner = event.target.result);
      reader.readAsDataURL(file);
    });

    this.dataForm.get('img_qr')?.valueChanges.subscribe((file: File) => {
      const reader = new FileReader();
      reader.onloadend = (event: any) => (this.img_qr = event.target.result);
      reader.readAsDataURL(file);
    });

    this.searchDataCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(500),
        tap(() => {
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
          };
          if (!value) delete filterdata.search;

          const params = new HttpParams({ fromObject: filterdata });
          return this._http.get('gimnasios', params).pipe(
            finalize(() => {
              this.isLoadingData = false;
            })
          );
        })
      )
      .subscribe((data: any) => {
        this.filteredData = data?.data?.data || [];
      });

    this.loadPaises();
  }

  loadcertificacions(): void {
    this._http.get(`certificacionesdata`).subscribe({
      next: (responser: any) => {
        this.certificaciones = responser.data;
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }

  onSelected(event: MatAutocompleteSelectedEvent): void {
    this.gimnasio = event.option.value;
    this.dataForm.patchValue({
      lat: this.gimnasio.lat,
      lng: this.gimnasio.lng,
      direccion: this.gimnasio.direccion,
      gimnasio_id: this.gimnasio.id
    });

    this.lat = parseFloat(this.gimnasio.lat);
    this.lng = parseFloat(this.gimnasio.lng);
  }

  clearSelection(): void {
    this.searchDataCtrl.patchValue('');
  }

  displayWith(value: any): string {
    return value ? value?.nombre : '';
  }

  onCenterChange(): void {
    const center = this.map.getCenter()!;
    this.dataForm.patchValue({
      lat: center.lat(),
      lng: center.lng(),
    });
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.id],
      precio: [this.data.precio, Validators.required],
      nombre: [this.data.nombre, Validators.required],
      imagen: [''],
      banner: [''],
      img_qr: [''],
      baucher: [''],
      descripcion: [this.data.descripcion],
      fecha_ini: [this.data.fecha_ini, Validators.required],
      fecha_fin: [this.data.fecha_fin, Validators.required],
      organizadores: [this.data.organizadores, Validators.required],
      premios_objetivos: [this.data.premios_objetivos, Validators.required],
      modo: [this.data.modo, Validators.required],
      tipo: [this.data.tipo, Validators.required],
      certificacion_id: [this.data.certificacion_id, Validators.required],
      lat: [this.data.lat || this.lat],
      lng: [this.data.lng || this.lng],
      direccion: [this.data.direccion],
      gimnasio_id: [this.data.gimnasio?.id || this.data.gimnasio_id || ''],
      ciudad_id: [
        this.data.ciudad_id,
        Validators.compose([Validators.required]),
      ],
      pai_id: [
        {
          value: this.data?.ciudad?.pai_id ?? this.user.pai_id,
          disabled: !this.ifauthenticadoAuth(['ceo', 'administrador']),
        },
        Validators.compose([Validators.required]),
      ],
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

  guardar() {
    const data1 = this.dataForm.value;
    console.log(data1);

    const formData = new FormData();

    formData.append('id', data1.id || '');
    formData.append('precio', data1.precio || '');
    formData.append('nombre', data1.nombre || '');
    if (data1.imagen) formData.append('imagen', data1.imagen);
    if (data1.banner) formData.append('banner', data1.banner);
    if (data1.img_qr) formData.append('img_qr', data1.img_qr);
    if (data1.baucher) formData.append('baucher', data1.baucher);

    formData.append('descripcion', data1.descripcion || '');
    formData.append('fecha_ini', moment(data1.fecha_ini).format('YYYY-MM-DD'));
    formData.append('fecha_fin', moment(data1.fecha_fin).format('YYYY-MM-DD'));
    formData.append('organizadores', data1.organizadores || '');
    formData.append('premios_objetivos', data1.premios_objetivos || '');
    formData.append('modo', data1.modo || '');
    formData.append('tipo', data1.tipo || '');
    formData.append('certificacion_id', data1.certificacion_id || '');
    formData.append('lat', data1.lat || '');
    formData.append('lng', data1.lng || '');
    formData.append('gimnasio_id', data1.gimnasio_id || '');
    formData.append('direccion', data1.direccion ? data1.direccion : '');
    formData.append('ciudad_id', data1.ciudad_id ? data1.ciudad_id : '');

    this.spinner.show();

    if (!data1.id) {
      this._http.post('actividads', formData).subscribe({
        next: (response) => {
          this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
          this.dialogRef.close(true);
          this.spinner.hide();
        },
        error: () => this.spinner.hide(),
        complete: () => this.spinner.hide(),
      });
    } else {
      formData.append('_method', 'PUT');
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this._http.post(`actividads/${data1.id}`, formData, headers).subscribe({
        next: (response) => {
          this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
          this.dialogRef.close(true);
          this.spinner.hide();
        },
        error: () => this.spinner.hide(),
        complete: () => this.spinner.hide(),
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  public loadPaises(): void {
    this._http.get(`paisdata`).subscribe({
      next: (responser: any) => {
        console.log("Paises", responser);
        this.paises = responser.data;
        if (this.data?.id && this.data?.ciudad?.pai_id) {
          this.selectpais(this.data.ciudad.pai_id);
        } else {
          this.selectpais(this.user.pai_id);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  selectpais(pais_id: any) {
    console.log(pais_id);
    this._http.get(`ciudaddata/${pais_id}`).subscribe({
      next: (responser: any) => {
        this.ciuadads = responser.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}

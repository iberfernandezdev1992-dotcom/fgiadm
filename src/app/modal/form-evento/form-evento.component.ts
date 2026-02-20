import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { GoogleMap } from '@angular/google-maps';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AuthUtils } from 'src/app/Service/auth.utils';

@Component({
  selector: 'app-form-evento',
  templateUrl: './form-evento.component.html',
  styleUrls: ['./form-evento.component.scss'],
})
export class FormEventoComponent implements OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Evento';
  data: any = '';
  paises: Array<any> = [];
  ciuadads: Array<any> = [];
  volumens: Array<any> = [];
  certificado: any;
  certificacions: Array<any> = [];
  gimnasio: any = '';
  filteredData: any;
  searchDataCtrl = new FormControl();
  isLoadingData = false;
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public fileControl: FormControl;
  imagenG: any;
  image: any;
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
  private subscription: Subscription | any;
  // options: google.maps.MapOptions = {
  //   center: { lat: 40.73061, lng: -73.935242 },
  //   zoom: 12,
  // };
  zoom = 12;
  lat: number = 40.73061; // Coordenadas iniciales (ejemplo: Nueva York)
  lng: number = -73.935242;
  // center: google.maps.LatLng = { lat: 40.73061, lng: -73.935242 };
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  user: any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormEventoComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    let user = localStorage.getItem('user') ?? '';
    this.user = JSON.parse(user);

    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Evento';
      this.image = this.data.imagen;
      this.gimnasio = this.data.gimnasio;
      // const newCenter: google.maps.LatLngLiteral = {
      //   lat: this.data.lat,
      //   lng: this.data.lng,
      // }; // Ejemplo: Chicago

      // if (this.map) {
      //   this.map.center = newCenter;
      // }

      this.lat = parseFloat(this.data.lat);
      this.lng = parseFloat(this.data.lng);
      this.zoom = 18;
    }
    this.dataForm = this.createForm();
    this.fileControl = new FormControl();
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
          };

          if (!value) {
            delete filterdata.search;
          }
          const params = new HttpParams({
            fromObject: filterdata,
            // encoder: new HttpUrlEncodingCodec(),
          });
          return this._http.get('gimnasios', params).pipe(
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

    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
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
    this.loadPaises();
    // this.loadVolumens();
    this.getcertificados();
  }
  onSelected(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value);
    this.gimnasio = event.option.value;
    this.dataForm.patchValue({ lat: this.gimnasio.lat });
    this.dataForm.patchValue({ lat: this.gimnasio.lat });
    this.dataForm.patchValue({ direccion: this.gimnasio.direccion });
    this.lat = parseFloat(this.gimnasio.lat);
    this.lng = parseFloat(this.gimnasio.lng);
  }
  displayWith(value: any): string {
    return value ? value?.nombre : '';
  }
  clearSelection(): void {
    this.searchDataCtrl.patchValue('');
    // this.loadData();
  }
  onCenterChange(): void {
    let latlng = this.map.getCenter()!;
    this.dataForm.patchValue({ lat: latlng.lat() });
    this.dataForm.patchValue({ lng: latlng.lng() });
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

  public loadPaises(): void {
    console.log(this.user);

    this._http.get(`paisdata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.paises = responser.data;
        if (this.data.id) {
          // this.dataForm.patchValue({ pai_id: this.userId });
          this.selectpais(this.data.ciudad.pai_id);
        } else {
          this.selectpais(this.user.pai_id);
        }
        // this.dataForm.controls['user_id'].setValue('1');
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
        // console.log(responser);
        this.ciuadads = responser.data;
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
  selectcert(cert: any) {
    console.log(cert.value);
    if (cert.value) {
      this.volumens = cert.value.volumens;
    }
  }
  getcertificados() {
    this.spinner.show();
    this._http.get(`certificacionesdata`).subscribe({
      next: (response: any) => {
        // console.log(response);
        this.certificacions = response.data;
        if (this.data) {
          let certificado = this.certificacions.find(
            (item) => item.id == this.data.volumen.certificacion_id
          );
          this.dataForm.patchValue({ certificado: certificado });
          this.volumens = certificado.volumens;
        }
        // this.dataForm.controls['user_id'].setValue('1');
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
  // public loadVolumens(): void {
  //   this._http.get(`volumensdata`).subscribe({
  //     next: (responser: any) => {
  //       // console.log(responser);
  //       this.volumens = responser.data;
  //       // if (!this.data) {
  //       //   this.dataForm.patchValue({ pai_id: this.userId });
  //       // }
  //       // this.dataForm.controls['user_id'].setValue('1');
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //     },
  //   });
  // }

  createForm(): FormGroup {
    console.log(this.data);
    return this._formBuilder.group({
      id: [this.data.id],
      fecha_ini: [
        this.data.fecha_ini,
        Validators.compose([Validators.required]),
      ],
      fecha_fin: [
        this.data.fecha_fin,
        Validators.compose([Validators.required]),
      ],
      horarios: [this.data.horarios, Validators.compose([Validators.required])],
      // imagen: [this.data.imagen],
      descripcion: [this.data.descripcion],
      nombre: [this.data.nombre],
      precio: [this.data.precio, Validators.compose([Validators.required])],
      nombre_capacitador: [
        this.data.nombre_capacitador,
        Validators.compose([Validators.required]),
      ],
      tipo: [this.data.tipo, Validators.compose([Validators.required])],
      estado: [this.data.estado, Validators.compose([Validators.required])],
      lat: [this.data.lat, Validators.compose([Validators.required])],
      lng: [this.data.lng, Validators.compose([Validators.required])],
      direccion: [this.data.direccion],
      ciudad_id: [
        this.data.ciudad_id,
        Validators.compose([Validators.required]),
      ],
      pai_id: [
        {
          value: this.data ? this.data.ciudad?.pai_id : this.user.pai_id,
          disabled: !this.ifauthenticadoAuth(['ceo', 'administrador']),
        },
        Validators.compose([Validators.required]),
      ],
      certificado: ['', Validators.compose([Validators.required])],
      volumen_id: [
        this.data.volumen_id,
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

    const formData = new FormData();

    if (this.imagenG) {
      // const filedata = this.control.value[0] as File;
      formData.append('imagen', this.imagenG);
    }

    formData.append('id', data1.id ? data1.id : '');
    formData.append(
      'fecha_ini',
      data1.fecha_ini ? moment(data1.fecha_ini).format('YYYY-MM-DD') : ''
    );
    formData.append(
      'fecha_fin',
      data1.fecha_fin ? moment(data1.fecha_fin).format('YYYY-MM-DD') : ''
    );
    formData.append('horarios', data1.horarios ? data1.horarios : '');
    // formData.append('imagen', data1.imagen ? data1.imagen : '');
    formData.append('descripcion', data1.descripcion ? data1.descripcion : '');
    formData.append('precio', data1.precio ? data1.precio : '');
    formData.append(
      'nombre_capacitador',
      data1.nombre_capacitador ? data1.nombre_capacitador : ''
    );
    formData.append('tipo', data1.tipo ? data1.tipo : '');
    formData.append('estado', data1.estado ? data1.estado : '');
    formData.append('lat', data1.lat ? data1.lat : '');
    formData.append('lng', data1.lng ? data1.lng : '');
    formData.append('direccion', data1.direccion ? data1.direccion : '');
    formData.append('nombre', data1.nombre ? data1.nombre : '');

    formData.append('ciudad_id', data1.ciudad_id ? data1.ciudad_id : '');
    formData.append('volumen_id', data1.volumen_id ? data1.volumen_id : '');
    formData.append('gimnasio_id', this.gimnasio.id);
    if (!data1.id) {
      this.spinner.show();
      this._http.post('eventos', formData).subscribe({
        next: (response) => {
          this.snackBar.open(response.mensaje, ':-)', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (msg) => {
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    } else {
      this.spinner.show();
      formData.append('_method', 'PUT');
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this._http.post(`eventos/${data1.id}`, formData, headers).subscribe({
        next: (response) => {
          this.spinner.hide();
          this.snackBar.open(response.mensaje, ':-)', {
            duration: 3000,
          });
          this.dialogRef.close(true);
        },
        error: (msg) => {
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

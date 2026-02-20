import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GoogleMap } from '@angular/google-maps';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { AuthUtils } from 'src/app/Service/auth.utils';
import { HttpService } from 'src/app/Service/http.service';

@Component({
  selector: 'app-form-gimnasio',
  templateUrl: './form-gimnasio.component.html',
  styleUrls: ['./form-gimnasio.component.scss'],
})
export class FormGimnasioComponent implements OnInit {
  public fileControl: FormControl;
  imagenG: any;
  image: any;
  public fileControl1: FormControl;
  bannerG: any;
  banner: any;

  dataForm: FormGroup;
  dialogTitle: string = 'Crear Gimnasio';
  data: any = '';
  ciuadads: Array<any> = [];
  paises: Array<any> = [];
  private subscription: Subscription | any;

  zoom = 12;
  lat: number = 40.73061; // Coordenadas iniciales (ejemplo: Nueva York)
  lng: number = -73.935242;
  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;
  user: any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormGimnasioComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    let user = localStorage.getItem('user') ?? '';
    this.user = JSON.parse(user);
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Gimnasio';
      this.image = this.data.imagen;
      this.banner = this.data.banner;
    }
    this.dataForm = this.createForm();
    this.fileControl = new FormControl();
    this.fileControl1 = new FormControl();
  }

  public ngOnInit(): void {
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
    this.fileControl1.valueChanges.subscribe((file: File) => {
      this.bannerG = file;
      var myReader1: FileReader = new FileReader();
      var that1 = this;
      myReader1.onloadend = function (loadEvent: any) {
        // image.src = loadEvent.target.result;
        that1.banner = loadEvent.target.result;
      };
      myReader1.readAsDataURL(file);
    });
    this.loadPaises();
  }

  onCenterChange(): void {
    let latlng = this.map.getCenter()!;
    this.dataForm.patchValue({ lat: latlng.lat() });
    this.dataForm.patchValue({ lng: latlng.lng() });
  }

  public loadPaises(): void {
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

  createForm(): FormGroup {
    console.log(this.data);
    return this._formBuilder.group({
      id: [this.data.id],
      nombre: [this.data.nombre, Validators.compose([Validators.required])],
      // banner: [this.data.banner],
      // imagen: [this.data.imagen],
      hoario: [this.data.hoario, Validators.compose([Validators.required])],
      direccion: [
        this.data.direccion,
        Validators.compose([Validators.required]),
      ],
      descripcion: [this.data.descripcion],
      estado: [this.data.estado, Validators.compose([Validators.required])],
      celular: [this.data.celular, Validators.compose([Validators.required])],
      lat: [this.data.lat, Validators.compose([Validators.required])],
      lng: [this.data.lng, Validators.compose([Validators.required])],
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
    if (this.bannerG) {
      // const filedata = this.control.value[0] as File;
      formData.append('banner', this.bannerG);
    }
    formData.append('id', data1.id ? data1.id : '');
    formData.append('nombre', data1.nombre ? data1.nombre : '');
    // formData.append('banner', data1.banner ? data1.banner : '');
    // formData.append('imagen', data1.imagen ? data1.imagen : '');
    formData.append('hoario', data1.hoario ? data1.hoario : '');
    formData.append('direccion', data1.direccion ? data1.direccion : '');
    formData.append('descripcion', data1.descripcion ? data1.descripcion : '');
    formData.append('estado', data1.estado ? data1.estado : '');
    formData.append('celular', data1.celular ? data1.celular : '');
    formData.append('lat', data1.lat ? data1.lat : '');
    formData.append('lng', data1.lng ? data1.lng : '');
    formData.append('ciudad_id', data1.ciudad_id ? data1.ciudad_id : '');

    if (!data1.id) {
      this.spinner.show();
      this._http.post('gimnasios', formData).subscribe({
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
      this._http.post(`gimnasios/${data1.id}`, formData, headers).subscribe({
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

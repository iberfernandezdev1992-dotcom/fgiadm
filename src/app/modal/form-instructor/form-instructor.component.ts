import {
  Component,
  ViewChild,
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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { HttpService } from 'src/app/Service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthUtils } from 'src/app/Service/auth.utils';
@Component({
  selector: 'app-form-instructor',
  templateUrl: './form-instructor.component.html',
  styleUrls: ['./form-instructor.component.scss'],
})
export class FormInstructorComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Instructor';
  data: any = '';

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public fileControl: FormControl;
  imagenG: any;
  image: any;

  paises: Array<any> = [];
  ciuadads: Array<any> = [];
  rangos: Array<any> = [];
  pais_id = '';
  codeaccesoramd = '';
  private subscription: Subscription | any;
  // public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
  //   ''
  // );
  // public fileControl: FormControl;
  // imagenG: any;
  // image: any;
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );

  // hide = true;
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
  user: any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormInstructorComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    let user = localStorage.getItem('user') ?? '';
    this.user = JSON.parse(user);
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Instructor';
      this.image = this.data.imagen;
    }
    this.codeaccesoramd = this.generaCadenaAleatoria(4);
    this.dataForm = this.createForm();
    this.fileControl = new FormControl();

  }
  ngAfterViewInit() {}
  public ngOnInit(): void {
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

  }

  public loadPaises(): void {
    this._http.get(`paisdata`).subscribe({
      next: (responser: any) => {
        console.log("Paises",responser);
        this.paises = responser.data;
        if (this.data.id) {
          // this.dataForm.patchValue({ pai_id: this.user.pai_id });
          console.log("entre qui");
          
          this.selectpais(this.data.ciudad.pai_id);
        }else {
          this.selectpais(this.user.pai_id);
        }
        // this.dataForm.controls['user_id'].setValue('1');
      },
      error: (err: any) => {
        console.log(err);
      },
    });

    this._http.get(`rangodata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.rangos = responser.data;
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
  selectpais(pais_id: any) {

    console.log(pais_id);
    this._http.get(`ciudaddata/${pais_id}`).subscribe({
      next: (responser: any) => {
        console.log("ciudades",responser);
        
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
    console.log(this.data);
    return this._formBuilder.group({
      id: [this.data.id],
      primer_nombre: [
        this.data.primer_nombre,
        Validators.compose([Validators.required]),
      ],
      segundo_nombre: [this.data.segundo_nombre],
      apellido_paterno: [
        this.data.apellido_paterno,
        Validators.compose([Validators.required]),
      ],
      apellido_materno: [this.data.apellido_materno],
      ci: [this.data.ci, Validators.compose([Validators.required])],
      emitido: [this.data.emitido, Validators.compose([Validators.required])],
      celular: [this.data.celular, Validators.compose([Validators.required])],

      descripcion: [this.data.descripcion],
      calificacion: [this.data.calificacion],
      fecha_nacimiento: [
        this.data.fecha_nacimiento,
        Validators.compose([Validators.required]),
      ],
      estado: [this.data.estado, Validators.compose([Validators.required])],
      email: [this.data.email, Validators.compose([Validators.required])],
      pai_id: [
        {
          value: this.data ? this.data.ciudad.pai_id : this.user.pai_id,
          disabled: !this.ifauthenticadoAuth(['ceo', 'administrador']),
        },
        Validators.compose([Validators.required]),
      ],
      ciudad_id: [
        this.data.ciudad_id,
        Validators.compose([Validators.required]),
      ],
      zona: [this.data.zona],
      codigo_acceso: [this.data.codigo_acceso],
      tipo: ['instructor'],
      rango_id: [this.data.rango_id, Validators.compose([Validators.required])],
      curos_interes: [this.data.curos_interes],
      estado_certificaciones:[this.data.estado_certificaciones]
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
      'primer_nombre',
      data1.primer_nombre ? data1.primer_nombre : ''
    );
    formData.append(
      'segundo_nombre',
      data1.segundo_nombre ? data1.segundo_nombre : ''
    );
    formData.append(
      'apellido_paterno',
      data1.apellido_paterno ? data1.apellido_paterno : ''
    );
    formData.append(
      'apellido_materno',
      data1.apellido_materno ? data1.apellido_materno : ''
    );
    formData.append(
      'codigo_acceso',
      data1.codigo_acceso ? data1.codigo_acceso : ''
    );
    formData.append('ci', data1.ci ? data1.ci : '');
    formData.append('emitido', data1.emitido ? data1.emitido : '');
    formData.append('celular', data1.celular ? data1.celular : '');
    formData.append('descripcion', data1.descripcion ? data1.descripcion : '');

    formData.append(
      'calificacion',
      data1.calificacion ? data1.calificacion : ''
    );
    formData.append(
      'fecha_nacimiento',
      data1.fecha_nacimiento
        ? moment(data1.fecha_nacimiento).format('YYYY-MM-DD')
        : ''
    );
    formData.append('estado', data1.estado ? data1.estado : '');
    formData.append('email', data1.email ? data1.email : '');
    formData.append('ciudad_id', data1.ciudad_id ? data1.ciudad_id : '');
        // formData.append('pai_id', data1.pai_id ? data1.pai_id : '');

    formData.append('zona', data1.zona ? data1.zona : '');
    formData.append('tipo', data1.tipo ? data1.tipo : '');
    formData.append('rango_id', data1.rango_id ? data1.rango_id : '');
formData.append('estado_certificaciones', data1.estado_certificaciones ? '1' : '0');

    formData.append(
      'curos_interes',
      data1.curos_interes ? data1.curos_interes : ''
    );
    if (!data1.id) {
      this.spinner.show();
      this._http.post('instructor', formData).subscribe({
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
      this._http.post(`instructor/${data1.id}`, formData, headers).subscribe({
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
  public generaCadenaAleatoria(n: number): string {
    let result = '';
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < n; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  insertCI() {
    let ci = this.dataForm.get('ci')?.value;
    console.log(ci);
    this.dataForm.patchValue({ codigo_acceso: ci + this.codeaccesoramd });
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

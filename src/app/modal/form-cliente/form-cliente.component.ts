import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  Inject,
  OnDestroy,
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
import { BehaviorSubject, Subscription, Subject, takeUntil } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';
import { AuthUtils } from 'src/app/Service/auth.utils';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
@Component({
  selector: 'app-form-cliente',
  templateUrl: './form-cliente.component.html',
  styleUrls: ['./form-cliente.component.scss'],
})
export class FormClienteComponent implements OnDestroy, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Cliente';
  data: any = '';
  cliente: any = '';
  userId: number;
  responsables: Array<any> = [];
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  // private subscription: Subscription | any;
  // private _unsubscribeAll: Subject<any> = new Subject<any>();
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
    public dialogRef: MatDialogRef<FormClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.fileControl = new FormControl();
    this.data = _data.data;
    this.dialogTitle = _data.title;
    this.cliente = _data.cliente;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Cliente';
      this.image = this.data.fotografia;
    }
    this.dataForm = this.createForm();
    this.userId = parseInt(AuthUtils.getUserID());
    // console.log(this.userId);
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
    // this.subscription = this.control.valueChanges.subscribe(
    //   (values: Array<File>) => this.getImage(values[0])
    // );
    if (!this.cliente) {
      this.loadResponsable();
    }
  }

  public ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    // this._unsubscribeAll.next(null);
    // this._unsubscribeAll.complete();
  }

  public loadResponsable(): void {
    console.log(this.userId);

    this._http.get(`user`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.responsables = responser.data;
        if (!this.data) {
          this.dataForm.patchValue({ user_id: this.userId });
        }
        // this.dataForm.controls['user_id'].setValue('1');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  private getImage(file: File): void {
    if (FileReader && file) {
      // console.log(file);

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
      informacion_preliminar: [
        this.data.informacion_preliminar,
        this.cliente ? '' : Validators.compose([Validators.required]),
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
      celular: [
        this.data.celular,
        !this.cliente ? Validators.compose([Validators.required]) : '',
      ],
      pasaporte: [this.data.pasaporte],
      cn: [this.data.cn],
      direccion: [this.data.direccion],
      email: [this.data.email, Validators.compose([Validators.email])],
      parentesco: [
        this.data.parentesco,
        this.cliente ? Validators.compose([Validators.required]) : '',
      ],
      user_id: [
        {
          value: this.data.user_id ? parseInt(this.data.user_id) : this.userId,
          disabled: this.ifauthenticadoAuth(['Operador']),
        },
        !this.cliente ? Validators.compose([Validators.required]) : '',
      ],
    });
  }

  guardar() {
    const data1 = this.dataForm.value;
    // console.log(data1);
    // return true;
    let a = data1.fecha_nacimiento
      ? moment(data1.fecha_nacimiento).format('YYYY-MM-DD')
      : '';
    // console.log(a);

    const formData = new FormData();
    // if (this.control.valid && this.control.value.length) {
    //   const filedata = this.control.value[0] as File;
    //   formData.append('fotografia', filedata);
    // }
    if (this.imagenG) {
      // const filedata = this.control.value[0] as File;
      formData.append('fotografia', this.imagenG);
    }
    formData.append('id', data1.id ? data1.id : '');
    // if (!this.cliente) {
    formData.append(
      'user_id',
      data1.user_id ? data1.user_id : this.userId + ''
    );
    // } else {
    //   formData.append('user_id', this.userId + '');
    // }
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
    if (this.cliente) {
      formData.append('cliente_id', this.cliente.id);
      formData.append('parentesco', data1.parentesco);
    }
    //

    // console.log(formData);

    // if (this.uploadedFile && this.uploadedFile != this.data.imagen) {
    //   data1.fotografia = this.uploadedFile.value;
    // }
    // console.log(data1);
    if (!data1.id) {
      this.spinner.show();
      this._http.post('cliente', formData).subscribe({
        next: (response) => {
          // console.log(response);
          // this.cargar();
          // console.log(response);
          // this.spinner.hide();
          // this.cancelar();
          this.snackBar.open(response.mensaje, ':-)', {
            duration: 3000,
          });
          this.guardarAdjuntos(response.data);
          // this.dialogRef.close(true);
        },
        error: (msg) => {
          this.spinner.hide();
        },
        complete: () => {
          this.spinner.hide();
        },
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmacionComponent, {
        width: '250px',
        data: {
          title:
            '¿Estás seguro de que deseas actualizar la información del dependiente?',
        },
      });
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.spinner.show();
          formData.append('_method', 'PUT');
          const headers = new HttpHeaders();
          headers.append('Content-Type', 'multipart/form-data');
          this._http.post(`cliente/${data1.id}`, formData, headers).subscribe({
            next: (response) => {
              // console.log(response);
              // this.cargar();
              // console.log(response);
              this.spinner.hide();
              // this.cancelar();
              this.snackBar.open(response.mensaje, ':-)', {
                duration: 3000,
              });
              this.guardarAdjuntos(response.data);
              // this.dialogRef.close(true);
            },
            error: (msg) => {
              this.spinner.hide();
            },
            complete: () => {
              this.spinner.hide();
            },
          });
        }
      });
    }
  }
  guardarAdjuntos(cliente: any) {
    if (this.controladjunto.value.length > 0) {
      this.spinner.show();
      this.controladjunto.value.forEach(async (data) => {
        const formData = new FormData();
        const filedata = data as File;
        formData.append('cliente_id', cliente.id);
        formData.append('adjunto', filedata);
        await this._http.post('adjunto', formData).subscribe({
          next: (response) => {
            // console.log(response);
            // this.cargar();
            // console.log(response);
            // this.spinner.hide();
            // this.cancelar();
            this.snackBar.open(response.mensaje, ':-)', {
              duration: 3000,
            });
            // this.dialogRef.close(true);
          },
          error: (msg) => {
            this.spinner.hide();
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      });
      // this.controladjunto.clear();
    }
    // this.dialogRef.close(cliente);
    this.dialogRef.close(JSON.stringify(cliente));
  }
  eliminarAdjunto(item: any) {}
  onNoClick(): void {
    this.dialogRef.close();
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
  mayus(event: any) {
    event.value = event.value.toUpperCase();
  }
}

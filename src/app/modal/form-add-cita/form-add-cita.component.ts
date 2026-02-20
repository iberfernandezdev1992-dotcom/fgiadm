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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
@Component({
  selector: 'app-form-add-cita',
  templateUrl: './form-add-cita.component.html',
  styleUrls: ['./form-add-cita.component.scss'],
})
export class FormAddCitaComponent implements OnDestroy, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Cliente';
  data: any = '';
  userId: number;
  responsables: Array<any> = [];
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

  private subscription: Subscription | any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
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
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormAddCitaComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Cliente';
    }
    this.dataForm = this.createForm();
    this.userId = parseInt(AuthUtils.getUserID());
    // console.log(this.userId);
  }
  public ngOnInit(): void {
    this.subscription = this.control.valueChanges.subscribe(
      (values: Array<File>) => this.getImage(values[0])
    );
    this.loadResponsable();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  public loadResponsable(): void {
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
        // console.log(err);
      },
    });
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
      cliente_id: [
        this.data.cliente_id,
        Validators.compose([Validators.required]),
      ],
      etapa: [this.data.etapa, Validators.compose([Validators.required])],
      estado: [this.data.estado, Validators.compose([Validators.required])],
      fecha_nacimiento: [
        this.data.fecha_nacimiento,
        Validators.compose([Validators.required]),
      ],
      fecha_inicio: [
        this.data.fecha_inicio,
        Validators.compose([Validators.required]),
      ],
      fecha_fin: [
        this.data.fecha_fin,
        Validators.compose([Validators.required]),
      ],
    });
  }

  guardar() {
    this.spinner.show();
    const data1 = this.dataForm.value;
    // console.log(data1);
    let a = data1.fecha_nacimiento
      ? moment(data1.fecha_nacimiento).format('YYYY-MM-DD')
      : '';
    // console.log(a);

    const formData = new FormData();
    if (this.control.valid && this.control.value.length) {
      const filedata = this.control.value[0] as File;
      formData.append('fotografia', filedata);
    }
    formData.append('id', data1.id ? data1.id : '');
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
    formData.append('contacto', data1.contacto ? data1.contacto : '');
    formData.append('email', data1.email ? data1.email : '');
    // formData.append('parentesco', data1.parentesco);

    // console.log(formData);

    // if (this.uploadedFile && this.uploadedFile != this.data.imagen) {
    //   data1.fotografia = this.uploadedFile.value;
    // }
    // console.log(data1);
    if (!data1.id) {
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
          this.dialogRef.close(true);
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
    } else {
      formData.append('_method', 'PUT');
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this._http.post(`cliente/${data1.id}`, formData, headers).subscribe({
        next: (response) => {
          // console.log(response);
          // this.cargar();
          // console.log(response);
          // this.spinner.hide();
          // this.cancelar();
          this.snackBar.open(response.mensaje, ':-)', {
            duration: 3000,
          });
          this.dialogRef.close(true);
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
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}

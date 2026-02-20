import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { FormPaisComponent } from '../form-pais/form-pais.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-form-volumen',
  templateUrl: './form-volumen.component.html',
  styleUrls: ['./form-volumen.component.scss'],
})
export class FormVolumenComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Volumen';
  data: any = '';
  certificaciones: Array<any> = [];

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public fileControl: FormControl;
  imagenG: any;
  image: any;
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );

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
  certificado_id = '';
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormPaisComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    this.certificado_id = _data.certificado_id;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Volumen';
      this.image = this.data.imagen;
    }
    this.dataForm = this.createForm();
    this.fileControl = new FormControl();
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
  }
  public ngOnInit(): void {
    this.loadCertificaciones();
  }

  public loadCertificaciones(): void {
    this._http.get(`certificacionesdata`).subscribe({
      next: (responser: any) => {
        console.log(responser);
        this.certificaciones = responser.data;
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
      nombre: [this.data.nombre, Validators.compose([Validators.required])],
      descripcion: [this.data.descripcion],
      order_by: [this.data.order_by],

      precio: [this.data.precio, Validators.compose([Validators.required])],
      certificacion_id: [
        this.data.certificacion_id
          ? this.data.certificacion_id
          : this.certificado_id,
        Validators.compose([Validators.required]),
      ],
    });
  }

  guardar() {
    const data1 = this.dataForm.value;

    const formData = new FormData();
    if (this.imagenG) {
      // const filedata = this.control.value[0] as File;
      formData.append('imagen', this.imagenG);
    }
    formData.append('id', data1.id ? data1.id : '');
    formData.append('nombre', data1.nombre ? data1.nombre : '');
    formData.append('descripcion', data1.descripcion ? data1.descripcion : '');
    formData.append('order_by', data1.order_by ? data1.order_by : '');

    formData.append('precio', data1.precio ? data1.precio : '');
    formData.append(
      'certificacion_id',
      data1.certificacion_id ? data1.certificacion_id : ''
    );

    if (!data1.id) {
      this.spinner.show();
      this._http.post('volumens', formData).subscribe({
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
      this._http.post(`volumens/${data1.id}`, formData, headers).subscribe({
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

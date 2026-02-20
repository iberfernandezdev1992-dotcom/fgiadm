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
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-form-certificacion',
  templateUrl: './form-certificacion.component.html',
  styleUrls: ['./form-certificacion.component.scss'],
})
export class FormCertificacionComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Programa';
  data: any = '';

  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );
  public fileControl: FormControl;
  public fileControl2: FormControl | any;

  imagenG: any;
  imagenG2: any;

  image: any;
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );
  paises: any = [];
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
  image2: any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormCertificacionComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Programa';
      this.image = this.data.imagen;
      this.image2 = this.data.portada;
      console.log(this.image2);

      
    }
    this.dataForm = this.createForm();
    this.fileControl = new FormControl();
    this.fileControl2 = new FormControl();
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
    this.loadPaises();
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
    this.fileControl2.valueChanges.subscribe((file: File) => {
      this.imagenG2 = file;
      var myReader: FileReader = new FileReader();
      var that = this;
      myReader.onloadend = function (loadEvent: any) {
        // image.src = loadEvent.target.result;
        that.image2 = loadEvent.target.result;
      };
      myReader.readAsDataURL(file);
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
      // pai_id: [this.data.pai_id, Validators.compose([Validators.required])],
      nombre: [this.data.nombre, Validators.compose([Validators.required])],
      color: [this.data.color, Validators.compose([Validators.required])],
      descripcion: [this.data.descripcion],
    });
  }

  guardar() {
    const data1 = this.dataForm.value;

    const formData = new FormData();
    if (this.imagenG) {
      // const filedata = this.control.value[0] as File;
      formData.append('imagen', this.imagenG);
    }
    if (this.imagenG2) {
      // const filedata = this.control.value[0] as File;
      formData.append('portada', this.imagenG2);
    }
    formData.append('id', data1.id ? data1.id : '');
    // formData.append('pai_id', data1.pai_id ? data1.pai_id : '');
    formData.append('nombre', data1.nombre ? data1.nombre : '');
    formData.append('color', data1.color ? data1.color : '');
    formData.append('descripcion', data1.descripcion ? data1.descripcion : '');

    if (!data1.id) {
      this.spinner.show();
      this._http.post('certificaciones', formData).subscribe({
        next: (response) => {
          console.log('post desde form', response);

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
      this._http
        .post(`certificaciones/${data1.id}`, formData, headers)
        .subscribe({
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
  public loadPaises(): void {
    this._http.get(`paisdata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.paises = responser.data;
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
  onNoClick(): void {
    this.dialogRef.close();
  }
}

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
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { HttpHeaders } from '@angular/common/http';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
@Component({
  selector: 'app-form-rango',
  templateUrl: './form-rango.component.html',
  styleUrls: ['./form-rango.component.scss'],
})
export class FormRangoComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Rango';
  data: any = '';

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
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormRangoComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Rango';
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
  }
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
      nombre: [this.data.nombre, Validators.compose([Validators.required])],
      color: [this.data.color, Validators.compose([Validators.required])],
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
    formData.append('color', data1.color ? data1.color : '');

    if (!data1.id) {
      this.spinner.show();
      this._http.post('rango', formData).subscribe({
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
      this._http.post(`rango/${data1.id}`, formData, headers).subscribe({
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

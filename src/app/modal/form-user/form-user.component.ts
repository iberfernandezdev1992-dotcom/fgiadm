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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FileUploadControl,
  FileUploadValidators,
} from '@iplab/ngx-file-upload';
import { BehaviorSubject, Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
@Component({
  selector: 'app-form-user',
  templateUrl: './form-user.component.html',
  styleUrls: ['./form-user.component.scss'],
})
export class FormUserComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Usuario';
  data: any = '';
  paises: any = [];
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );
  public readonly uploadedFile: BehaviorSubject<string> = new BehaviorSubject(
    ''
  );

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
    public dialogRef: MatDialogRef<FormUserComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Usuario';
    }
    this.dataForm = this.createForm();
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
    this.loadPaises();
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
    return this._formBuilder.group({
      id: [this.data.id],
      pai_id: [
        this.data.pai_id,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      nombre: [
        this.data.nombre,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      email: [
        this.data.email,
        Validators.compose([Validators.required, Validators.email]),
      ],
      password: ['', this.data ?? Validators.compose([Validators.required])],
      rol: [this.data.rol, Validators.compose([Validators.required])],
    });
  }

  guardar() {
    this.spinner.show();
    const data1 = this.dataForm.value;

    if (!data1.id) {
      this._http.post('users', data1).subscribe({
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
      this._http.put(`users/${data1.id}`, data1).subscribe({
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

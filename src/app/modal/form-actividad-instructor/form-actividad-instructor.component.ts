import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';

@Component({
  selector: 'app-form-actividad-instructor',
  templateUrl: './form-actividad-instructor.component.html',
  styleUrls: ['./form-actividad-instructor.component.scss'],
})
export class FormActividadInstructorComponent {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Asociar Actividad';
  data: any = '';
  certificaciones: Array<any> = [];
  actividades: Array<any> = [];
  instructor: any = '';
  userDatos: any = [];
  private subscription: Subscription | any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormActividadInstructorComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.instructor = _data.instructor;
    this.data = _data.data;
    if (this.data.id) {
      this.userDatos = JSON.parse(this.data.pivot.user_datos);
      this.dialogTitle = 'Actualizar Asociar Actividad';
    }
    this.dataForm = this.createForm();
  }

  public ngOnInit(): void {
    this.loadcertificacions();
  }

  public loadcertificacions(): void {
    this._http.get(`certificacionesActividades`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.certificaciones = responser.data;
        if (this.data) {
          let index = this.certificaciones.findIndex(
            (val) => val.id == this.data.certificacion_id
          );
          this.dataForm.patchValue({
            certificacion_id: this.certificaciones[index],
          });
          this.actividades = this.certificaciones[index].actividades;

          this.dataForm.patchValue({
            actividad_id: this.data.pivot.actividad_id,
          });
        }

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

  public loadactividades(data: any): void {
    console.log(data);
    this.actividades = data.actividades;
    // this._http.get(`actividadesdata/${id}`).subscribe({
    //   next: (responser: any) => {
    //     // console.log(responser);
    //     this.actividades = responser.data;
    //     // if (!this.data) {
    //     //   this.dataForm.patchValue({ pai_id: this.userId });
    //     // }
    //     // this.dataForm.controls['user_id'].setValue('1');
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    // });
  }

  addUsda() {
    this.userDatos.push({ key: '', valor: '' });
  }

  createForm(): FormGroup {
    console.log(this.data);
    return this._formBuilder.group({
      id: [this.data?.pivot?.id],
      instructor_id: [
        this.instructor.id,
        Validators.compose([Validators.required]),
      ],
      certificacion_id: [
        this.data.certificacion_id,
        Validators.compose([Validators.required]),
      ],
      actividad_id: [
        this.data.actividad_id,
        Validators.compose([Validators.required]),
      ],
    });
  }

  guardar() {
    const data1 = this.dataForm.value;

    const formData = new FormData();
    formData.append('id', data1.id ? data1.id : '');
    formData.append(
      'instructor_id',
      data1.instructor_id ? data1.instructor_id : ''
    );
    formData.append(
      'actividad_id',
      data1.actividad_id ? data1.actividad_id : ''
    );
    formData.append(
      'user_datos',
      this.userDatos ? JSON.stringify(this.userDatos) : ''
    );
    if (!data1.id) {
      this.spinner.show();
      this._http.post('actividadInstructor', formData).subscribe({
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
      this._http
        .post(`actividadInstructor/${data1.id}`, formData, headers)
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}

import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';

@Component({
  selector: 'app-form-galeria',
  templateUrl: './form-galeria.component.html',
  styleUrls: ['./form-galeria.component.scss']
})
export class FormGaleriaComponent implements OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Galeria';
  data: any = '';
  indumentarias: Array<any> = [];

  private subscription: Subscription | any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormGaleriaComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Galeria';
    }
    this.dataForm = this.createForm();
  }

  public ngOnInit(): void {
    this.loadIndumentarias();
  }

  public loadIndumentarias(): void {
    this._http.get(`indumentariasdata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.indumentarias = responser.data;
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
      indumentaria_id: [this.data.indumentaria_id, Validators.compose([Validators.required])],
    });
  }

  guardar() {
    const data1 = this.dataForm.value;

    const formData = new FormData();
    formData.append('id', data1.id ? data1.id : '');
    formData.append('nombre', data1.nombre ? data1.nombre : '');
    formData.append('indumentaria_id', data1.indumentaria_id ? data1.indumentaria_id : '');
    if (!data1.id) {
      this.spinner.show();
      this._http.post('galerias', formData).subscribe({
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
      this._http.post(`galerias/${data1.id}`, formData, headers).subscribe({
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


import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { FormCiudadComponent } from '../form-ciudad/form-ciudad.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpHeaders } from '@angular/common/http';
import * as moment from 'moment';

@Component({
  selector: 'app-form-gasto',
  templateUrl: './form-gasto.component.html',
  styleUrls: ['./form-gasto.component.scss'],
})
export class FormGastoComponent implements OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Gasto';
  data: any = '';
  eventos: Array<any> = [];
  evento: any;
  url = '';
  private subscription: Subscription | any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormCiudadComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    this.evento = _data.evento;
    this.url = _data.url;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Gasto';
    }
    this.dataForm = this.createForm();
  }

  public ngOnInit(): void {
    this.loadEventos();
  }

  public loadEventos(): void {
    this._http.get(`eventosdata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.eventos = responser.data;
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
      monto: [this.data.monto, Validators.compose([Validators.required])],
      fecha: [this.data.fecha, Validators.compose([Validators.required])],
      evento_id: [
        this.evento ? this.evento.id : this.data.evento_id,
        Validators.compose([Validators.required]),
      ],
    });
  }

  guardar() {
    const data1 = this.dataForm.value;

    const formData = new FormData();
    formData.append('id', data1.id ? data1.id : '');
    formData.append('nombre', data1.nombre ? data1.nombre : '');
    formData.append('monto', data1.monto ? data1.monto : '');
    formData.append(
      'fecha',
      data1.fecha ? moment(data1.fecha).format('YYYY-MM-DD') : ''
    );
    if (this.url == 'gastos') {
      formData.append('evento_id', data1.evento_id ? data1.evento_id : '');
    }
    if (this.url == 'actividadGasto') {
      formData.append('actividad_id', data1.evento_id ? data1.evento_id : '');
    }

    if (!data1.id) {
      this.spinner.show();
      this._http.post(this.url, formData).subscribe({
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
      this._http.post(`${this.url}/${data1.id}`, formData, headers).subscribe({
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

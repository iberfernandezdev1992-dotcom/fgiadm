import { HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthUtils } from 'src/app/Service/auth.utils';

@Component({
  selector: 'app-form-indumentaria',
  templateUrl: './form-indumentaria.component.html',
  styleUrls: ['./form-indumentaria.component.scss'],
})
export class FormIndumentariaComponent implements OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Indumentaria';
  data: any = '';
  certificaciones: Array<any> = [];

  private subscription: Subscription | any;
  public readonly controladjunto = new FileUploadControl({
    listVisible: true,
    multiple: true,
  });
  paises: any = [];
  user: any;
  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormIndumentariaComponent>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    let user = localStorage.getItem('user') ?? '';
    this.user = JSON.parse(user);
    this.data = _data.data;
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Indumentaria';
    }
    this.dataForm = this.createForm();
  }

  public ngOnInit(): void {
    this.loadCertificaciones();
    this.loadPaises();
  }

  public loadCertificaciones(): void {
    this._http.get(`certificacionesdata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
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
  public loadPaises(): void {
    this._http.get(`paisdata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.paises = responser.data;
        // if (this.data.id) {
        //   // this.dataForm.patchValue({ pai_id: this.userId });
        //   this.selectpais(this.data.ciudad.pai_id);
        // } else {
        //   this.selectpais(this.user.pai_id);
        // }
        // this.dataForm.controls['user_id'].setValue('1');
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  // eliminarAdjunto(item: any) {

  // }
  deleteGaleria(data: any, index: number): void {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar?',
      },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`galerias/${data.id}`).subscribe({
          next: (response) => {
            // console.log(response);
            this.data.galerias.splice(index, 1);
            this.snackBar.open(response.mensaje, ':-)', {
              duration: 3000,
            });
          },
          error: (err) => {
            this.spinner.hide();
            // this.message(err);
            this.snackBar.open(err, ':-(', {
              duration: 3000,
            });
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      }
    });
  }
  createForm(): FormGroup {
    console.log(this.data);
    return this._formBuilder.group({
      id: [this.data.id],
      codigo_producto: [
        this.data.codigo_producto,
        Validators.compose([Validators.required]),
      ],
      nombre: [this.data.nombre, Validators.compose([Validators.required])],
      descripcion: [this.data.descripcion],
      talla: [this.data.talla, Validators.compose([Validators.required])],
      tipo: [this.data.tipo, Validators.compose([Validators.required])],
      certificacion_id: [
        this.data.certificacion_id,
        Validators.compose([Validators.required]),
      ],
      precio: [this.data.precio, Validators.compose([Validators.required])],
      descuento: [
        this.data.descuento,
        Validators.compose([Validators.required]),
      ],
      estado: [this.data.estado, Validators.compose([Validators.required])],
      pai_id: [
        {
          value: this.data ? this.data.pai_id : this.user.pai_id,
          disabled: !this.ifauthenticadoAuth(['ceo', 'administrador']),
        },
        Validators.compose([Validators.required]),
      ],
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
  guardarAdjuntos(indumentaria: any) {
    if (this.controladjunto.value.length > 0) {
      this.spinner.show();
      const promises = this.controladjunto.value.map((data: any) => {
        const formData = new FormData();
        const filedata = data as File;
        formData.append('indumentaria_id', indumentaria.id);
        formData.append('imagen', filedata);

        return new Promise<void>((resolve, reject) => {
          this._http.post('galerias', formData).subscribe({
            next: (response) => {
              this.snackBar.open(response.mensaje, ':-)', {
                duration: 3000,
              });
              resolve();
            },
            error: (msg) => {
              this.spinner.hide();
              reject(msg);
            },
            complete: () => {
              this.spinner.hide();
            },
          });
        });
      });

      Promise.all(promises)
        .then(() => {
          this.dialogRef.close(true);
        })
        .catch(() => {
          // Manejo de errores en caso de que alguna petición falle
        });
    } else {
      this.dialogRef.close(true);
    }
  }
  guardar() {
    const data1 = this.dataForm.value;

    const formData = new FormData();
    formData.append('id', data1.id ? data1.id : '');

    formData.append(
      'codigo_producto',
      data1.codigo_producto ? data1.codigo_producto : ''
    );
    formData.append('nombre', data1.nombre ? data1.nombre : '');
    formData.append('descripcion', data1.descripcion ? data1.descripcion : '');
    formData.append('talla', data1.talla ? data1.talla : '');
    formData.append('tipo', data1.tipo ? data1.tipo : '');
    formData.append(
      'certificacion_id',
      data1.certificacion_id ? data1.certificacion_id : ''
    );
    formData.append('precio', data1.precio ? data1.precio : '');
    formData.append('descuento', data1.descuento ? data1.descuento : '');
    formData.append('estado', data1.estado ? data1.estado : '');
    formData.append('pai_id', data1.pai_id ? data1.pai_id : '');
    if (!data1.id) {
      this.spinner.show();
      this._http.post('indumentarias', formData).subscribe({
        next: (response) => {
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
      this.spinner.show();
      formData.append('_method', 'PUT');
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'multipart/form-data');
      this._http
        .post(`indumentarias/${data1.id}`, formData, headers)
        .subscribe({
          next: (response) => {
            this.spinner.hide();
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
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

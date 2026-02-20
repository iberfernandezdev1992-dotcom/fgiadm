import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';

@Component({
  selector: 'app-form-examen',
  templateUrl: './form-examen.component.html',
  styleUrls: ['./form-examen.component.scss'],
})
export class FormExamenComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Examen';

  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormExamenComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log("este es",this.data);
    
    if (data.data.id) {
      this.dialogTitle = 'Actualizar Examen';
    }
    this.dataForm = this.createForm();
  }

  ngAfterViewInit() {}

  ngOnInit(): void {}

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.data.id],
      titulo: [this.data.data.titulo, Validators.required],
      cantidad_preguntas: [this.data.data.cantidad_preguntas, Validators.required],
    });
  }

  guardar() {
    const dataFormValues = this.dataForm.value;
    const formData = new FormData();
    formData.append('titulo', dataFormValues.titulo ? dataFormValues.titulo : '');
    formData.append('certificacion_id', this.data.certificado_id);
    formData.append('cantidad_preguntas', dataFormValues.cantidad_preguntas ? dataFormValues.cantidad_preguntas : '');

    this.spinner.show();

    if (!dataFormValues.id) {
      this._http.post('examenes', formData).subscribe({
        next: (response) => {
          this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => this.spinner.hide(),
        complete: () => this.spinner.hide(),
      });
    } else {
      formData.append('_method', 'PUT');
      this._http.post(`examenes/${dataFormValues.id}`, formData).subscribe({
        next: (response) => {
          this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => this.spinner.hide(),
        complete: () => this.spinner.hide(),
      });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

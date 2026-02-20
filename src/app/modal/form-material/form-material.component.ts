import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { FormPaisComponent } from '../form-pais/form-pais.component';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-form-material',
  templateUrl: './form-material.component.html',
  styleUrls: ['./form-material.component.scss'],
})
export class FormMaterialComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Material';
  data: any = '';
  volumens: Array<any> = [];
  volumenData:any;
  // public fileUploadControl = new FileUploadControl(
  //   { listVisible: false, discardInvalid: true, accept: ['image/*'] },
  //   FileUploadValidators.filesLimit(1)
  // );

  constructor(
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    public dialogRef: MatDialogRef<FormPaisComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    this.volumenData = _data.volumenData;

    console.log(this.data);
    
    if (this.data.id) {
      this.dialogTitle = 'Actualizar Material';
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
    this.loaddata();
  }

  public loaddata(): void {
    this._http.get(`volumensdata`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.volumens = responser.data;
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
      name: [this.data.name, Validators.compose([Validators.required])],
      ruta: [this.data?.tipo == 'Video' ? this.data.ruta : ''],
      portada: [''],
      manual: [''],
      nota: [''],
      tipo: [
        this.data.tipo ? this.data.tipo : 'Video',
        Validators.compose([Validators.required]),
      ],
      volumen_id: [
        this.volumenData.id,
        Validators.compose([Validators.required]),
      ],
    });
  }

  guardar() {
    const data1 = this.dataForm.value;

    const formData = new FormData();

    formData.append('id', data1.id ? data1.id : '');
    formData.append('name', data1.name ? data1.name : '');
    formData.append('ruta', data1.ruta ? data1.ruta : '');
    formData.append('portada', data1.portada ? data1.portada : '');
    formData.append('manual', data1.manual ? data1.manual : '');
    formData.append('nota', data1.nota ? data1.nota : '');
    formData.append('tipo', data1.tipo ? data1.tipo : '');
    formData.append('volumen_id', data1.volumen_id ? data1.volumen_id : '');

    if (!data1.id) {
      this.spinner.show();
      this._http.post('materials', formData).subscribe({
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
      this._http.post(`materials/${data1.id}`, formData, headers).subscribe({
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

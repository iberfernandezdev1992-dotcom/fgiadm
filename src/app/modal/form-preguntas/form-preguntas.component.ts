import { AfterViewInit, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-preguntas',
  templateUrl: './form-preguntas.component.html',
  styleUrls: ['./form-preguntas.component.scss'],
})
export class FormPreguntasComponent implements AfterViewInit, OnInit {
  dataForm: FormGroup;
  dialogTitle: string = 'Crear Examen';
  respuestaCorrectaOptions: string[] = [];
  dataId: any;

  constructor(
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private _http: HttpService,
    private snackBar: MatSnackBar,
    private routeactiv: ActivatedRoute,
    public dialogRef: MatDialogRef<FormPreguntasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataForm = this.createForm();
    this.dataId = this.routeactiv.snapshot.paramMap.get('id');
    console.log(this.data);
    if (data.data.id) {
      this.dialogTitle = 'Actualizar Pregunta';
    }else{
      this.dialogTitle = 'Crear Pregunta';

    }
  }

  createForm(): FormGroup {
    return this._formBuilder.group({
      id: [this.data.data.id],
      opciones_respuesta: [[]],  // Inicializamos como un arreglo vacío
      pregunta: [this.data.data.pregunta || '', Validators.required],
      tipo_pregunta: [this.data.data.tipo_pregunta || '', Validators.required],
      respuesta_correcta: [this.data.data.respuesta_correcta || '', Validators.required],
    });
  }

  ngAfterViewInit() {}

  ngOnInit(): void {
    // Si estamos en modo edición (cuando hay un ID), llenamos el formulario con los datos
    if (this.data.data.id) {
      const opcionesRespuesta = this.data.data.opciones_respuesta || [];
      this.dataForm.patchValue({
        pregunta: this.data.data.pregunta,
        tipo_pregunta: this.data.data.tipo_pregunta,
        respuesta_correcta: this.data.data.respuesta_correcta,
        opciones_respuesta: opcionesRespuesta, // Aseguramos que las opciones sean un array
      });

      // Si el tipo de pregunta es "seleccion_unica", definimos las opciones de respuesta
      this.onTipoPreguntaChange(); // Esto ajustará las opciones correctamente
    }
  }

  onTipoPreguntaChange(): void {
    const tipoPregunta = this.dataForm.get('tipo_pregunta')?.value;

    if (tipoPregunta === 'verdadero_falso') {
      // Si el tipo es "verdadero_falso", establecemos las opciones y el valor de "opciones_respuesta" como un arreglo
      this.respuestaCorrectaOptions = ['verdadero', 'falso'];
      this.dataForm.get('opciones_respuesta')?.setValue(this.respuestaCorrectaOptions);  // Establecemos como arreglo
      // Si el valor actual de respuesta_correcta no está en las opciones, lo dejamos vacío
      if (!this.respuestaCorrectaOptions.includes(this.dataForm.get('respuesta_correcta')?.value)) {
        this.dataForm.get('respuesta_correcta')?.setValue('');
      }
    } else if (tipoPregunta === 'seleccion_unica') {
      // Si se selecciona "selección única", aseguramos que las opciones sean un arreglo vacío si no existen
      this.respuestaCorrectaOptions = this.dataForm.get('opciones_respuesta')?.value || [];
      if (!this.respuestaCorrectaOptions.includes(this.dataForm.get('respuesta_correcta')?.value)) {
        this.dataForm.get('respuesta_correcta')?.setValue('');
      }
    }
  }

  // Aseguramos que las opciones estén en el formato correcto antes de guardar
  updateRespuestaCorrectaOptions(): void {
    const opciones = this.dataForm.get('opciones_respuesta')?.value || '';
    this.respuestaCorrectaOptions = opciones.split(',').map((opcion: string) => opcion.trim());
    this.dataForm.get('opciones_respuesta')?.setValue(this.respuestaCorrectaOptions); // Actualizamos las opciones
  }

  guardar() {
    const dataFormValues = this.dataForm.value;
    console.log(dataFormValues);
    
    // Aseguramos que 'opciones_respuesta' esté en formato de arreglo
    let opcionesRespuesta = dataFormValues.opciones_respuesta;
    
    // Si 'opciones_respuesta' es una cadena (por ejemplo, separada por comas), la convertimos en arreglo
    if (typeof opcionesRespuesta === 'string') {
      opcionesRespuesta = opcionesRespuesta.split(',').map((opcion: string) => opcion.trim());
    }
    
    // Si 'opciones_respuesta' no es un arreglo, la convertimos en uno vacío
    if (!Array.isArray(opcionesRespuesta)) {
      opcionesRespuesta = [];
    }
  
    // Construimos el objeto con los datos del formulario
    const body = {
      examen_id: this.data.examen_id,
      pregunta: dataFormValues.pregunta || '',
      tipo_pregunta: dataFormValues.tipo_pregunta || '',
      respuesta_correcta: dataFormValues.respuesta_correcta || '',
      opciones_respuesta: opcionesRespuesta  // Aseguramos que sea un arreglo
    };
  
    this.spinner.show();
  
    if (!dataFormValues.id) {
      // Si no hay ID, hacemos un POST para crear una nueva pregunta
      this._http.post(`examenes/${this.data.examen_id}/preguntas`, body).subscribe({
        next: (response) => {
          this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: () => this.spinner.hide(),
        complete: () => this.spinner.hide(),
      });
    } else {
      console.log("entre aqui al put con el examen",this.data.examen_id);

      
      // Si hay ID, probablemente estés en modo edición y utilizaremos un PUT
      this._http.put(`examenes/${this.data.examen_id}/preguntas/${dataFormValues.id}`, body).subscribe({
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

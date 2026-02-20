import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { HttpService } from 'src/app/Service/http.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from './confirm/confirm.component';
import { FormPreguntasComponent } from 'src/app/modal/form-preguntas/form-preguntas.component';

@Component({
  selector: 'app-ver-preguntas-respuestas',
  templateUrl: './ver-preguntas-respuestas.component.html',
  styleUrls: ['./ver-preguntas-respuestas.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VerPreguntasRespuestasComponent {
  // preguntas = [
  //   {
  //     titulo: '¿Cuál es la capital de Francia?',
  //     descripcion: 'Seleccione la respuesta correcta',
  //     opciones: ['París', 'Roma', 'Madrid', 'Berlín']
  //   },
  //   {
  //     titulo: '¿Cuál es el lenguaje de programación más popular en 2024?',
  //     descripcion: 'Seleccione la respuesta correcta',
  //     opciones: ['Python', 'JavaScript', 'Java', 'C#']
  //   }
  // ];
  data: any = '';
  dataId: any;
  marker: any = {};
  public readonly controladjunto = new FileUploadControl({
    listVisible: true,
    multiple: true,
  });
  preguntas: any;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private spinner: NgxSpinnerService,
    private routeactiv: ActivatedRoute
  ) {
    // console.log(this.route.snapshot.paramMap);
    this.dataId = this.routeactiv.snapshot.paramMap.get('id');
    console.log(this.dataId);

    this.loadPreguntas();
    // this.route.queryParams.subscribe((params) => {
    //   console.log(params);
    // });
  }
  public ngOnInit(): void {
    // this.fileControl.valueChanges.subscribe((values: Array<File>) =>
    //   this.getImage(values[0])
    // );
  }



  loadPreguntas(): void {
    this.spinner.show();
    this._http.get(`examenes/${this.dataId}/preguntas`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.preguntas = responser.data;
        // this.dataSource1.paginator = this.paginator1;
        console.log("preguntas", this.data);

      },
      error: (err) => {
        this.spinner.hide();
        console.log(err);
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  agregarPregunta() {
    // console.log('modal');
    const dialogRef = this.dialog.open(FormPreguntasComponent, {
      width: '50vw',
      disableClose: true,
      data: { data: '', examen_id: this.dataId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        console.log(result);
        this.loadPreguntas();
      }
    });
  }

  editarPregunta(data: any) {
      // console.log('modal');
      console.log(data);
      
      const dialogRef = this.dialog.open(FormPreguntasComponent, {
        width: '50vw',
        disableClose: true,
        data: { data,  examen_id: this.dataId },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        // console.log(`Dialog result: ${result}`);
        if (result) {
          this.loadPreguntas();
        }
      });
  }

  eliminarPregunta(data: any) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    console.log(data);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this._http.delete(`examenes/${this.dataId}/preguntas/${data.id}`).subscribe({
          next: (response) => {
            this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
            // Llamar a la función para cargar las preguntas nuevamente
            this.loadPreguntas(); 
          },
          error: () => this.spinner.hide(),
          complete: () => this.spinner.hide(),
        });
      }
    });
  }
}
import { HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUploadControl } from '@iplab/ngx-file-upload';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { FormActividadInstructorComponent } from 'src/app/modal/form-actividad-instructor/form-actividad-instructor.component';
import { FormActividadComponent } from 'src/app/modal/form-actividad/form-actividad.component';
import { FormCitaComponent } from 'src/app/modal/form-cita/form-cita.component';
import { FormClienteComponent } from 'src/app/modal/form-cliente/form-cliente.component';
import { FormCompraComponent } from 'src/app/modal/form-compra/form-compra.component';
import { FormServicioComponent } from 'src/app/modal/form-servicio/form-servicio.component';
import { FormVentaIndumentariaComponent } from 'src/app/modal/form-venta-indumentaria/form-venta-indumentaria.component';
import { VerDatosComponent } from 'src/app/modal/ver-datos/ver-datos.component';
import { FormGastoComponent } from '../form-gasto/form-gasto.component';
import { FormVolumenComponent } from '../form-volumen/form-volumen.component';
import { FormExamenComponent } from '../form-examen/form-examen.component';
import { ConfirmDialogComponentEx } from '../ver-programa/confirm/confirm.component';
import { FormMaterialApoyoComponent } from '../form-material-apoyo/form-material-apoyo.component';

@Component({
  selector: 'app-ver-programa',
  templateUrl: './ver-programa.component.html',
  styleUrls: ['./ver-programa.component.scss'],
})
export class VerProgramaComponent {
  displayedColumns: string[] = [
    'id',
    'imagen',
    'nombre',
    'descripcion',
    'precio',
    'certificacion_id',
    'created_at',
    'acciones',
  ];

  displayedColumnsExamenes: string[] = [
    'id',
    'titulo',
    'cantidad_preguntas',
    'acciones',
  ];

  displayedColumnsMateriales: string[] = [
    'id',
    'nombre',
    'url',
    'acciones',
  ];

  @ViewChild('sortVolumens') sortV!: MatSort;
  dataSourceVolumens: MatTableDataSource<any> = new MatTableDataSource();
  dataSourceExamenes: MatTableDataSource<any> = new MatTableDataSource();
  dataSourceMateriales: MatTableDataSource<any> = new MatTableDataSource();

 
  // dataSourceExamenes = [
  //   { id: 1, nombre: 'Examen 1', descripcion: 'Descripción del examen 1', fecha: new Date() },
  //   { id: 2, nombre: 'Examen 2', descripcion: 'Descripción del examen 2', fecha: new Date() },
  //   // Agrega más datos de ejemplo si lo necesitas
  // ];
  data: any = '';
  dataId: any;
  marker: any = {};
  public readonly controladjunto = new FileUploadControl({
    listVisible: true,
    multiple: true,
  });
  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private _formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private routeactiv: ActivatedRoute
  ) {
    // console.log(this.route.snapshot.paramMap);
    this.dataId = this.routeactiv.snapshot.paramMap.get('id');
    console.log(this.dataId);
    
    this.loadData();
    this.loadDataExamenes();
    // this.route.queryParams.subscribe((params) => {
    //   console.log(params);
    // });
  }
  public ngOnInit(): void {
    // this.fileControl.valueChanges.subscribe((values: Array<File>) =>
    //   this.getImage(values[0])
    // );
  }

  onTabChange(tab: string): void {
    if (tab === 'volumenes') {
      this.loadData();
    } else if (tab === 'examenes') {
      this.loadDataExamenes();
    } else if (tab === 'materiales') {
      this.loadDataMateriales();
    }
  }
  
  loadDataMateriales(): void {
    this.spinner.show();
    this._http.get(`vewmateriales/${this.dataId}`).subscribe({
      next: (responser: any) => {
        // Suponiendo que la lista de materiales se almacena en `this.data.materiales`
        this.dataSourceMateriales = new MatTableDataSource(responser.data);
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
  

  loadData(): void {
    this.spinner.show();
    this._http.get(`vewprograma/${this.dataId}`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.data = responser.data;
        this.dataSourceVolumens = new MatTableDataSource(this.data.volumens);
        // this.dataSource1.paginator = this.paginator1;
        this.dataSourceVolumens.sort = this.sortV;
        console.log("voluenes",this.dataSourceVolumens);
        
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

  loadDataExamenes(): void {
    this.spinner.show();
    this._http.get(`vewexamenes/${this.dataId}`).subscribe({
      next: (responser: any) => {
        console.log("examenes",responser);
        this.data = responser.data;
        this.dataSourceExamenes = new MatTableDataSource(this.data.examenes);
        // this.dataSource1.paginator = this.paginator1;
        // this.dataSourceVolumens.sort = this.sortV;
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
  create(): void {
    // console.log('modal');
    const dialogRef = this.dialog.open(FormVolumenComponent, {
      width: '50vw',
      disableClose: true,
      data: { data: '', certificado_id: this.data.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }
  edit(data: any): void {
    // console.log('modal');

    const dialogRef = this.dialog.open(FormVolumenComponent, {
      width: '50vw',
      disableClose: true,
      data: { data, certificado_id: this.data.id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }

  delete(data: any): void {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a este Volumen?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`volumens/${data.id}`).subscribe({
          next: (response) => {
            // console.log(response);
            this.message(response.mensaje);
            this.loadData();
          },
          error: (err) => {
            this.spinner.hide();
            this.message(err);
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      }
    });
  }
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }
  mayus(event: any) {
    event.value = event.value.toUpperCase();
  }

  message(m: string): void {
    this.snackBar.open(m, 'Cerrar', {
      duration: 4000,
    });
  }

  vermateriales(item: any) {
    this.router.navigateByUrl('/volumenmaterials', {
      state: { volumendata: item },
    });
  }


  deleteExamen(data:any){
    const dialogRef = this.dialog.open(ConfirmDialogComponentEx);
    console.log(data);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this._http.delete(`examenes/${data.id}`).subscribe({
          next: (response) => {
            console.log("errr",response);
            
            this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
            // Llamar a la función para cargar las preguntas nuevamente
            this.loadDataExamenes(); 
          },
          error: () => this.spinner.hide(),
          complete: () => this.spinner.hide(),
        });
      }
    });
  }

  editExamen(data:any){
  console.log('modal',data);

  const dialogRef = this.dialog.open(FormExamenComponent, {
    width: '50vw',
    disableClose: true,
    data: { data, certificado_id: this.data.id },
  });

  dialogRef.afterClosed().subscribe((result) => {
    // console.log(`Dialog result: ${result}`);
    if (result) {
      this.loadDataExamenes();
    }
  });
  }

  viewExamen(any:any){

  }

  createExamen(){
   // console.log('modal');
   const dialogRef = this.dialog.open(FormExamenComponent, {
    width: '50vw',
    disableClose: true,
    data: { data: '', certificado_id: this.data.id },
  });

  dialogRef.afterClosed().subscribe((result) => {
    // console.log(`Dialog result: ${result}`);
    if (result) {
      this.loadDataExamenes();
    }
  });
  }



  createMaterial() {
    // console.log('modal');
    console.log(this.data.id);
    
    const dialogRef = this.dialog.open(FormMaterialApoyoComponent, {
      width: '50vw',
      disableClose: true,
      data: { data: '', certificado_id: this.dataId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadDataMateriales();
      }
    });
   }
verMaterial(element:any) { /* Lógica para ver material */ }
editMaterial(element:any) { 
  console.log('modal',element);

  const dialogRef = this.dialog.open(FormMaterialApoyoComponent, {
    width: '50vw',
    disableClose: true,
    data: { data:element, certificado_id: this.dataId },
  });

  dialogRef.afterClosed().subscribe((result) => {
    // console.log(`Dialog result: ${result}`);
    if (result) {
      this.loadDataMateriales();
    }
  });
 }
deleteMaterial(element:any) { 
  const dialogRef = this.dialog.open(ConfirmDialogComponentEx);
  console.log(element);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      console.log(result);
      this._http.delete(`materiald/${element.id}`).subscribe({
        next: (response) => {        
          this.snackBar.open('','Se elimino el elemento :-)', { duration: 3000 });
          // Llamar a la función para cargar las preguntas nuevamente
          this.loadDataMateriales(); 
        },
        error: () => this.spinner.hide(),
        complete: () => this.spinner.hide(),
      });
    }
  });
}
}

import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';

@Component({
  selector: 'app-compras-actualizaciones',
  templateUrl: './compras-actualizaciones.component.html',
  styleUrls: ['./compras-actualizaciones.component.scss']
})
export class ComprasActualizacionesComponent implements OnInit, AfterViewInit {
  displayedColumns0: string[] = [
    'certificado',
    'imagen',
    'volumen',
    'tipo',
    'nombre',
    'estado',
    'total',
    'created_at',
    'accion',
  ];

  // ⚡ Filtro actualizado: solo una fecha
  filterValues = {
    fecha: null,
    instructor: ''
  };

  @ViewChild('sort0') sort0!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource0: MatTableDataSource<any> = new MatTableDataSource();

  dataForm!: FormGroup;
  data: any = null;
  clienteId: any;
  public fileControl!: FormControl;
  imagenG: any;
  image: any;

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {
    this.fileControl = new FormControl();
    this.clienteId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.dataSource0.sort = this.sort0;
    this.dataSource0.paginator = this.paginator;
  }

  loadData(): void {
    this.spinner.show();
    this._http.get(`compra-actualizaciones-general`).subscribe({
      next: (res: any) => {
        this.data = res.data;
        console.log("compra recibida:", this.data);

        this.dataSource0.data = this.data;
        if (this.paginator) {
          this.dataSource0.paginator = this.paginator;
        }
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  deletec(item: any) {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: { title: '¿Estás seguro de que deseas eliminar?' },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`compras/${item.id}`).subscribe({
          next: (res: any) => {
            this.snackBar.open(res.mensaje, ':-)', { duration: 3000 });
            this.loadData();
          },
          error: (err) => {
            console.error(err);
            this.spinner.hide();
          },
          complete: () => {
            this.spinner.hide();
          },
        });
      }
    });
  }

  cambiarestadoc(item: any, estado: string) {
    this.spinner.show();
    const compra = { estado };
    this._http.put(`compras/${item.id}/estado`, compra).subscribe({
      next: (response: any) => {
        this.snackBar.open(response.mensaje, ':-)', { duration: 3000 });
        this.loadData();
      },
      error: (err) => {
        console.error(err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  // ⚡ Filtro actualizado
  applyFilter() {
    this.dataSource0.filterPredicate = (data: any, filter: string) => {
      // Filtrar por fecha
      const fechaFiltro = this.filterValues.fecha ? new Date(this.filterValues.fecha).setHours(0,0,0,0) : null;
      const fechaRow = new Date(data.created_at).setHours(0,0,0,0);
      const fechaValid = !fechaFiltro || fechaRow === fechaFiltro;

      // Filtrar por instructor
      const instructor = this.filterValues.instructor?.toLowerCase() || '';
      const instructorName = `${data.instructor?.primer_nombre || ''} ${data.instructor?.apellido_paterno || ''} ${data.instructor?.apellido_materno || ''}`.toLowerCase();
      const instructorValid = instructorName.includes(instructor);

      return fechaValid && instructorValid;
    };

    this.dataSource0.filter = '' + Math.random(); // dispara el filtro
  }

  clearFilter() {
    this.filterValues = { fecha: null, instructor: '' };
    this.dataSource0.filter = '' + Math.random(); // resetea
  }
}

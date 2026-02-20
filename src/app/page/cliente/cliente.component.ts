import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import {
  debounceTime,
  distinctUntilChanged,
  finalize,
  fromEvent,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { FormClienteComponent } from 'src/app/modal/form-cliente/form-cliente.component';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormCitaComponent } from 'src/app/modal/form-cita/form-cita.component';
import { ClienteViewComponent } from '../cliente-view/cliente-view.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild('search', { static: true }) search: ElementRef | any;
  isLoadingResults = true;
  isRateLimitReached = false;
  displayedColumns: string[] = [
    'id',
    'fotografia',
    'nombres',
    'apellidos',
    'ci',
    'celular',
    'email',
    // 'estado',
    'created_at',
    // 'acciones',
  ];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  filtertable = {
    start: '',
    end: '',
    page: 0,
    limit: 5,
    column: 'created_at',
    order: 'desc',
    user_id: '',
    search: '',
  };
  clickedRows = new Set<any>();
  responsables: Array<any> = [];
  /**
   * Constructor
   */
  constructor(
    private dialog: MatDialog,
    private http: HttpService,
    private snackbar: MatSnackBar,
    private spinner: NgxSpinnerService
  ) {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.loadResponsable();
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        map((event: any) => event.target.value),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        this.paginator.pageIndex = 0;
        this.filtertable.search = text;
        this.loadData();
      });
    setTimeout(() => {
      this.loadData();
    }, 1000);
  }
  ifvalInput() {
    return this.search.nativeElement.value !== '';
  }
  clearInput() {
    this.search.nativeElement.value = '';
    this.paginator.pageIndex = 0;
    this.filtertable.search = '';
    this.loadData();
  }
  pageChanged(event: PageEvent): void {
    // if (
    //   this.pageSize !== event.pageSize ||
    //   event.pageIndex !== event.previousPageIndex
    // ) {
    //   this.pageSize = event.pageSize;
    //   // this.currentPage = event.pageIndex;
    //   console.log(this.paginator);
    // console.log(event);
    this.loadData();
    // }
  }
  announceSortChange(sortState: Sort): void {
    // console.log(sortState);
    this.filtertable.order = sortState.direction;
    this.filtertable.column = sortState.active;
    this.paginator.pageIndex = 0;
    this.loadData();
  }
  selectfilter(): void {
    this.paginator.pageIndex = 0;
    this.loadData();
  }
  loadData(): void {
    this.filtertable.limit = this.paginator.pageSize;
    this.filtertable.page = this.paginator.pageIndex + 1;
    const params = new HttpParams({
      fromObject: this.filtertable,
      // encoder: new HttpUrlEncodingCodec(),
    });
    // const filteredObje = {};
    // Object.keys(this.filter).filter((property) => {
    //   if (this.filter[property] !== 'All') {
    //     filteredObje[property] = this.filter[property];
    //   }
    // });
    this.http.get(`cliente`, params).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.isLoadingResults = false;
        this.isRateLimitReached = responser.data.data === null;
        this.dataSource.data = responser.data.data;
        this.paginator.pageIndex = responser.data.current_page - 1;
        this.paginator.length = responser.data.total;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  create(): void {
    // console.log('modal');
    const dialogRef = this.dialog.open(FormClienteComponent, {
      // width: '100vw',
      disableClose: true,
      data: { data: '', title: 'Crear Cliente' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        const cl = JSON.parse(result);
        this.loadData();
        this.getcitas(cl);
      }
    });
  }

  delete(data: any): void {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a este Cliente?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this.http.delete(`cliente/${data.id}`).subscribe({
          next: (response) => {
            // console.log(response);
            this.message(response.mensaje);
            this.paginator.pageIndex = 0;
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

  edit(data: any): void {
    // console.log('modal');

    const dialogRef = this.dialog.open(FormClienteComponent, {
      width: '100vw',
      disableClose: true,
      data: { data, title: 'Editar cliente' },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }
  getcitas(data: any) {
    const dialogRef = this.dialog.open(FormCitaComponent, {
      width: '90vw',
      maxWidth: '90vw',
      // height: '80vh',
      minHeight: '88vh',
      disableClose: true,
      data: { data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }
  verCliente(data: any) {
    const dialogRef = this.dialog.open(ClienteViewComponent, {
      width: '95vw',
      maxWidth: '95vw',
      // minHeight: '95vh',
      disableClose: true,
      data: { data },
    });

    // dialogRef.afterClosed().subscribe((result) => {
    //   console.log(`Dialog result: ${result}`);
    //   if (result) {
    //     this.loadData();
    //   }
    // });
  }

  message(m: string): void {
    this.snackbar.open(m, 'Cerrar', {
      duration: 4000,
    });
  }

  cambiarestado(item: any, estado: string) {
    this.spinner.show();
    const data = {
      estado,
    };
    this.http.put(`cliente/${item.id}`, data).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        item.estado = estado;
        this.message(responser.mensaje);
        // this.loadData();
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

  public loadResponsable(): void {
    this.http.get(`user`).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.responsables = responser.data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
  filterdate() {
    this.paginator.pageIndex = 0;
    this.loadData();
  }
}

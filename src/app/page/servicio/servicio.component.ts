import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
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

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent implements OnInit, OnDestroy {
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
    'created_at',
    'acciones',
  ];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  filtertable = {
    page: 0,
    limit: 5,
    column: 'created_at',
    order: 'desc',
    search: '',
  };
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
      data: { data: '' },
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
      data: { data },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // console.log(`Dialog result: ${result}`);
      if (result) {
        this.loadData();
      }
    });
  }

  message(m: string): void {
    this.snackbar.open(m, 'Cerrar', {
      duration: 4000,
    });
  }
}

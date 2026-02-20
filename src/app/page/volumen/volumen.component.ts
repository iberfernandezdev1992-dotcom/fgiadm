import { HttpParams } from '@angular/common/http';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { FormVolumenComponent } from 'src/app/modal/form-volumen/form-volumen.component';

@Component({
  selector: 'app-volumen',
  templateUrl: './volumen.component.html',
  styleUrls: ['./volumen.component.scss'],
})
export class VolumenComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild('search', { static: true }) search: ElementRef | any;
  isLoadingResults = true;
  isRateLimitReached = false;
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
    private router: Router,
    private dialog: MatDialog,
    private _http: HttpService,
    private snackBar: MatSnackBar,
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
    this.loadData();
  }
  announceSortChange(sortState: Sort): void {
    // console.log(sortState);
    this.filtertable.order = sortState.direction;
    this.filtertable.column = sortState.active;
    this.paginator.pageIndex = 0;
    this.loadData();
  }
  // selectfilter(): void {
  //   this.paginator.pageIndex = 0;
  //   this.loadData();
  // }
  loadData(): void {
    this.filtertable.limit = this.paginator.pageSize;
    this.filtertable.page = this.paginator.pageIndex + 1;
    const params = new HttpParams({
      fromObject: this.filtertable,
      // encoder: new HttpUrlEncodingCodec(),
    });

    this._http.get(`volumens`, params).subscribe({
      next: (responser: any) => {
        //console.log(responser);
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
    const dialogRef = this.dialog.open(FormVolumenComponent, {
      width: '50vw',
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
  edit(data: any): void {
    // console.log('modal');

    const dialogRef = this.dialog.open(FormVolumenComponent, {
      width: '50vw',
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
}

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
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  finalize,
  fromEvent,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { HttpService } from 'src/app/Service/http.service';
import { ConfirmacionComponent } from 'src/app/modal/confirmacion/confirmacion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FormCiudadComponent } from 'src/app/modal/form-ciudad/form-ciudad.component';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-ciudad',
  templateUrl: './ciudad.component.html',
  styleUrls: ['./ciudad.component.scss'],
})
export class CiudadComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: true }) sort: MatSort | any;
  @ViewChild('search', { static: true }) search: ElementRef | any;
  isLoadingResults = true;
  isRateLimitReached = false;
  displayedColumns: string[] = [
    'id',
    'pai_id',
    'nombre',
    'created_at',
    'acciones',
  ];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  filtertable = {
    pais_id: '',
    page: 0,
    limit: 5,
    column: 'created_at',
    order: 'desc',
    search: '',
  };

  // selectsear
  searchDataCtrl = new FormControl();
  filteredData: any;
  isLoadingData = false;
  errorMsg!: string;
  minLengthTerm = 3;
  // endselect
  /**
   * Constructor
   */
  constructor(
    private dialog: MatDialog,
    private _http: HttpService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder
  ) {}
  ngOnDestroy(): void {}
  ngOnInit(): void {
    // select search
    this.searchDataCtrl.valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = '';
          this.filteredData = [];
          this.isLoadingData = true;
        }),
        switchMap((value: any) => {
          const filterdata = {
            page: 1,
            limit: 5,
            column: 'nombre',
            order: 'asc',
            search: value,
          };

          if (!value) {
            delete filterdata.search;
          }
          const params = new HttpParams({
            fromObject: filterdata,
            // encoder: new HttpUrlEncodingCodec(),
          });
          return this._http.get('pais', params).pipe(
            finalize(() => {
              this.isLoadingData = false;
            })
          );
        })
      )
      .subscribe((data: any) => {
        if (!data.data.data.length) {
          this.errorMsg = data['Error'];
          this.filteredData = [];
        } else {
          this.errorMsg = '';
          this.filteredData = data.data.data;
        }
      });
    // end select
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

  loadData(): void {
    this.filtertable.limit = this.paginator.pageSize;
    this.filtertable.page = this.paginator.pageIndex + 1;
    const params = new HttpParams({
      fromObject: this.filtertable,
      // encoder: new HttpUrlEncodingCodec(),
    });

    this._http.get(`ciudad`, params).subscribe({
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
    const dialogRef = this.dialog.open(FormCiudadComponent, {
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
  edit(data: any): void {
    // console.log('modal');

    const dialogRef = this.dialog.open(FormCiudadComponent, {
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

  delete(data: any): void {
    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de que deseas eliminar a esta ciudad?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`ciudad/${data.id}`).subscribe({
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

  // selectsearch
  onSelected(event: MatAutocompleteSelectedEvent): void {
    this.paginator.pageIndex = 0;
    if (event.option.value) {
      this.filtertable.pais_id = event.option.value.id;
    }
    console.log(this.filtertable);

    this.loadData();
  }

  displayWith(value: any): string {
    return value?.nombre;
  }

  clearSelection(): void {
    this.searchDataCtrl.patchValue('');
    this.filtertable.pais_id = '';
    this.filteredData = [];
    this.paginator.pageIndex = 0;
    this.loadData();
  }
  // end select
}

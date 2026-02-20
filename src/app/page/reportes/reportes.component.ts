import {
  Component,
  OnInit,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';
import { HttpParams } from '@angular/common/http';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { VerDatosComponent } from 'src/app/modal/ver-datos/ver-datos.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit, OnDestroy {
  // print
  @ViewChild('repo1') repo1!: ElementRef<HTMLTableElement>;
  @ViewChild('repo2') repo2!: ElementRef<HTMLTableElement>;
  // endprint
  @ViewChild('pagesirg') paginator: MatPaginator | any;
  @ViewChild('sortventas', { static: true }) sort: MatSort | any;
  @ViewChild('search', { static: true }) search: ElementRef | any;
  isLoadingResults = true;
  isRateLimitReached = false;
  displayedColumns: string[] = [
    'created_at',
    'servicio',
    'estado',
    'monto',
    'descuento',
    'total',
    'pagado',
    'saldo',
    'cliente',
    'acciones',
  ];

  pageSizeOptions: number[] = [100, 1000];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  filtertable = {
    start: moment(new Date().setDate(1)).format('YYYY-MM-DD'),
    end: '',
    page: 0,
    limit: 5,
    column: 'created_at',
    order: 'desc',
    search: '',
  };

  ////
  @ViewChild('pageserv') paginatorserv!: MatPaginator;
  displayedColumnsserv: string[] = ['nombre', 'cantidad', 'total'];
  @ViewChild('sortserv') sortServ!: MatSort;
  dataSourceservicios: MatTableDataSource<any> = new MatTableDataSource();
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
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
  getreposervicios() {
    const params = new HttpParams({
      fromObject: this.filtertable,
      // encoder: new HttpUrlEncodingCodec(),
    });
    this.http.get(`reporteServicios`, params).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.dataSourceservicios = new MatTableDataSource(responser.datos);
        this.dataSourceservicios.paginator = this.paginatorserv;
        this.dataSourceservicios.sort = this.sortServ;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  applyFilterservicios(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceservicios.filter = filterValue.trim().toLowerCase();

    if (this.dataSourceservicios.paginator) {
      this.dataSourceservicios.paginator.firstPage();
    }
  }
  filterdate() {
    // console.log(this.range.value);

    // this.filtertable.start = this.range.value.start
    //   ? moment(this.range.value.start).format('YYYY-MM-DD')
    //   : '';

    // this.filtertable.end = this.range.value.end
    //   ? moment(this.range.value.end).format('YYYY-MM-DD')
    //   : '';
    // console.log(this.filtertable);

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
    this.spinner.show();
    this.http.get(`reporte`, params).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.isLoadingResults = false;
        this.isRateLimitReached = responser.data.data === null;
        this.dataSource.data = responser.data.data;
        this.paginator.pageIndex = responser.data.current_page - 1;
        this.paginator.length = responser.data.total;
        this.getreposervicios();
        this.spinner.hide();
      },
      error: (err) => {
        console.log(err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }

  message(m: string): void {
    this.snackbar.open(m, 'Cerrar', {
      duration: 4000,
    });
  }
  getTotalserv() {
    return this.dataSourceservicios.data
      .map((t: any) => parseFloat(t.total_ventas))
      .reduce((acc, value) => acc + value, 0);
  }
  getcantidadserv() {
    return this.dataSourceservicios.data
      .map((t: any) => parseFloat(t.servicios_ventas))
      .reduce((acc, value) => acc + value, 0);
  }
  getTotalCost() {
    return this.dataSource.data
      .map((t: any) => parseFloat(t.total))
      .reduce((acc, value) => acc + value, 0);
  }
  getcantidadCost() {
    return this.dataSource.data
      .map((t: any) => parseFloat(t.servicios.length))
      .reduce((acc, value) => acc + value, 0);
  }

  verventa(data: any) {
    const dialogRef = this.dialog.open(VerDatosComponent, {
      // width: '100vw',
      disableClose: true,
      data: {
        data,
        cliente: {
          nombre: data.nombres,
          apellidos: data.apellidos,
          ci: data.ci,
          celular: data.celular,
        },
        vista: 'Venta',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  // verventa(data: any) {
  //   // console.log('modal');
  //   const dialogRef = this.dialog.open(VerDatosComponent, {
  //     // width: '100vw',
  //     // disableClose: true,
  //     data: { data, vista: 'Venta' },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     // console.log(`Dialog result: ${result}`);
  //     if (result) {
  //       this.loadData();
  //     }
  //   });
  // }
  pagado(val: any) {
    let pagado = 0;
    val.forEach((element: any) => {
      pagado += parseFloat(element.monto);
    });
    return pagado;
  }
  getTotalpagado() {
    return this.dataSource.data
      .map((t: any) => this.pagado(t.pagos))
      .reduce((acc, value) => acc + value, 0);
  }
  getTotalSaldo() {
    return this.dataSource.data
      .map((t: any) => t.total - this.pagado(t.pagos))
      .reduce((acc, value) => acc + value, 0);
  }
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }

  repoprint1() {
    setTimeout(() => {
      const printContent = this.repo1.nativeElement.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow?.document.open();
      printWindow?.document.write(`
        <html>
          <head>
            <!-- Agrega aquí tus estilos CSS -->
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);

      setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
      }, 500);
    }, 1000);
  }
  repoprint2() {
    setTimeout(() => {
      const printContent = this.repo2.nativeElement.innerHTML;
      const printWindow = window.open('', '_blank');
      printWindow?.document.open();
      printWindow?.document.write(`
        <html>
          <head>
            <!-- Agrega aquí tus estilos CSS -->
            <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" rel="stylesheet">
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);

      setTimeout(() => {
        printWindow?.print();
        printWindow?.close();
      }, 500);
    }, 1000);
  }
}

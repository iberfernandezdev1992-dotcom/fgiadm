import {
  Component,
  Inject,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpService } from 'src/app/Service/http.service';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';
import { ConfirmacionComponent } from '../confirmacion/confirmacion.component';
@Component({
  selector: 'app-ver-datos',
  templateUrl: './ver-datos.component.html',
  styleUrls: ['./ver-datos.component.scss'],
})
export class VerDatosComponent implements OnInit {
  // @ViewChild('monto', { static: true }) monto!: ElementRef;
  @ViewChild('tableRef') tableElement!: ElementRef<HTMLTableElement>;
  @ViewChild('tableventaRef') tableventaElement!: ElementRef<HTMLTableElement>;
  pagoprint: any;
  data: any;
  pago: any = {
    venta_id: '',
    metodo_pago: 'Efectivo',
    monto: '',
    fecha: new Date(),
    // numero_recibo: '',
  };
  cliente: any;
  private timer: any;
  cambios = false;
  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dataval: any,
    private snackBar: MatSnackBar,
    private _http: HttpService,
    private spinner: NgxSpinnerService
  ) {
    // console.log(dataval);
    this.data = dataval.data;
    this.cliente = dataval.cliente;
  }
  public ngOnInit(): void {
    // if (this.dataval.vista == 'Venta') {
    // setTimeout(() => {
    // fromEvent(this.monto.nativeElement, 'keyup')
    //   .pipe(
    //     map((event: any) => event.target.value),
    //     debounceTime(1000),
    //     distinctUntilChanged()
    //   )
    //   .subscribe((text: number) => {
    //     let pagado = 0;
    //     this.data.pagos.forEach((element: any) => {
    //       pagado += element.monto;
    //     });
    //     if (pagado + text > this.data.total) {
    //       this.pago.monto = 0;
    //       this.snackBar.open(
    //         'El monto no tiene que ser mayor al total de la venta',
    //         ':-(',
    //         {
    //           duration: 3000,
    //         }
    //       );
    //     }
    //   });
    // }, 2000);
    // }
    // this.subscription = this.control.valueChanges.subscribe(
    //   (values: Array<File>) => this.getImage(values[0])
    // );
  }

  getimg(item: string) {
    return item ? item : 'assets/img/img-default.jpg';
  }
  totalpagado() {
    let pagado = 0;
    this.data.pagos.forEach((element: any) => {
      pagado += parseFloat(element.monto);
    });
    return pagado;
  }
  deleteventa(item: any, index: number) {
    console.log(index);

    const dialogRef = this.dialog.open(ConfirmacionComponent, {
      width: '250px',
      data: {
        title: '¿Estás seguro de eliminar el pago de esta Venta?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.spinner.show();
        this._http.delete(`pago/${item.id}`).subscribe({
          next: (responser: any) => {
            // console.log(responser);
            this.message(responser.mensaje);
            this.data.pagos.splice(index, 1);
            this.cambios = true;
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
    });
  }
  calcularmontoapagar() {
    // console.log(this.pago.monto);

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      let pagado = 0;
      this.data.pagos.forEach((element: any) => {
        pagado += parseFloat(element.monto);
      });
      // console.log(pagado);

      if (pagado + parseFloat(this.pago.monto) > this.data.total) {
        this.pago.monto = '';
        this.snackBar.open(
          'El monto no tiene que ser mayor al total de la venta',
          ':-(',
          {
            duration: 3000,
          }
        );
      }
    }, 500);
  }
  guardarpago() {
    // console.log(this.data);
    this.spinner.show();
    this.pago.venta_id = this.data.id;
    this.pago.fecha = this.pago.fecha
      ? moment(this.pago.fecha).format('YYYY-MM-DD hh:mm:ss')
      : '';
    this._http.post(`pago`, this.pago).subscribe({
      next: (responser: any) => {
        // console.log(responser);
        this.message(responser.mensaje);
        this.data.pagos.unshift(responser.data);
        this.pago.monto = '';
        // this.pago.numero_recibo = '';
        this.cambios = true;
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
  updatecita(data: any) {
    const valdata = {
      id: data.id,
      cliente_id: data.cliente_id,
      start: data.start,
      end: data.end,
      etapa: data.etapa,
      estado: data.estado,
    };

    this._http.put(`cita/${data.id}`, valdata).subscribe({
      next: (response) => {
        // console.log(response);
        // this.cargar();
        // console.log(response);
        // this.spinner.hide();
        // this.cancelar();
        this.snackBar.open(response.mensaje, ':-)', {
          duration: 3000,
        });
        // this.dialogRef.close(true);
      },
      error: (msg) => {
        this.spinner.hide();
        this.snackBar.open(msg, ':-(', {
          duration: 3000,
        });
      },
      complete: () => {
        this.spinner.hide();
      },
    });
  }
  message(m: string): void {
    this.snackBar.open(m, 'Cerrar', {
      duration: 4000,
    });
  }

  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }
  reciboprintventa() {
    setTimeout(() => {
      const printContent = this.tableventaElement.nativeElement.innerHTML;
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
  reciboprint(pago: any) {
    this.pagoprint = pago;

    setTimeout(() => {
      const printContent = this.tableElement.nativeElement.innerHTML;
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

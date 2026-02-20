import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'table-cita',
  styleUrls: ['./table-cita.component.scss'],
  templateUrl: './table-cita.component.html',
  // standalone: true,
  // imports: [
  //   MatFormFieldModule,
  //   MatInputModule,
  //   MatTableModule,
  //   MatSortModule,
  //   MatPaginatorModule,
  // ],
})
export class TableCitaComponent implements AfterViewInit {
  displayedColumns: string[] = ['etapa', 'estado', 'start', 'end', 'accion'];
  dataSource: MatTableDataSource<any>;
  // dataSource: MatTableDataSource<any> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Utiliza '!' para indicar que está inicializada
  @ViewChild(MatSort) sort!: MatSort;
  @Input() data: any;
  constructor() {
    // Create 100 users
    // const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    // console.log(this.data);

    this.dataSource = new MatTableDataSource(this.data);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

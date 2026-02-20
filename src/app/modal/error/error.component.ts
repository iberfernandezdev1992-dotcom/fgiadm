import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent {
  error: string;
  constructor(
    public dialogRef: MatDialogRef<ErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log(data);

    this.error = data.mensaje;
  }

  ngOnInit() {}
}

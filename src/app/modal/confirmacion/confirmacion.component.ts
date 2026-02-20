import { Component, OnInit, Inject } from '@angular/core';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
export interface DialogData {
  confirmacion: boolean;
  name: string;
}

@Component({
  selector: 'app-confirmacion',
  templateUrl: './confirmacion.component.html',
  styleUrls: ['./confirmacion.component.scss'],
})
export class ConfirmacionComponent implements OnInit {
  valdata: any;
  constructor(
    public dialogRef: MatDialogRef<ConfirmacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    // console.log(data);

    this.valdata = data;
  }

  ngOnInit() {}
  confirm(val: boolean): void {
    this.dialogRef.close(val);
  }
}

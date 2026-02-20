import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm.component.html',
})
export class ConfirmDialogComponentEx {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponentEx>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Cierra el diálogo y retorna true
  }

  onCancel(): void {
    this.dialogRef.close(false); // Cierra el diálogo y retorna false
  }
}
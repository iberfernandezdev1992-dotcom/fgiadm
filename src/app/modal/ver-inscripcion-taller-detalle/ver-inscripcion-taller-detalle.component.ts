import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

@Component({
  selector: 'app-ver-inscripcion-taller-detalle',
  templateUrl: './ver-inscripcion-taller-detalle.component.html',
  styleUrls: ['./ver-inscripcion-taller-detalle.component.scss']
})
export class VerInscripcionTallerDetalleComponent {
// data: any;
  constructor(
    public dialogRef: MatDialogRef<VerInscripcionTallerDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.data = data.data;
    console.log("Lo que tengo",this.data);
    console.log(this.data.pagos);
    
  }
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }
  trackById(index: number, item: any): number {
    return item.id;
  }
  onClose(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common'; // Asegúrate de importar CommonModule

@Component({
  selector: 'app-ver-inscripcion-certificacion-detalle',
  templateUrl: './ver-inscripcion-certificacion-detalle.component.html',
  styleUrls: ['./ver-inscripcion-certificacion-detalle.component.scss']
})
export class VerInscripcionCertificacionDetalleComponent {
  data: any;
  constructor(
    public dialogRef: MatDialogRef<VerInscripcionCertificacionDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.data = _data.data;
    console.log(this.data);
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

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ver-indumentaria-pedido',
  templateUrl: './ver-indumentaria-pedido.component.html',
  styleUrls: ['./ver-indumentaria-pedido.component.scss'],
})
export class VerIndumentariaPedidoComponent {
  dataval: any;
  constructor(
    public dialogRef: MatDialogRef<VerIndumentariaPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public _data: any
  ) {
    this.dataval = _data.data;
    console.log(this.dataval);
    
  }
  parse(data: any) {
    return parseFloat(data).toFixed(2);
  }

    // Función para imprimir el detalle
    imprimirDetalle(): void {
      const printWindow = window.open('', '_blank', 'width=800, height=600');
      if (printWindow) {
        // Función para construir el nombre del instructor
        const getFullName = (instructor: any) => {
          return [instructor.primer_nombre, instructor.segundo_nombre, instructor.apellido_paterno, instructor.apellido_materno]
            .filter(name => name) // Filtrar solo valores que no sean null, undefined o strings vacías
            .join(' '); // Unir con un espacio
        };
    
        // Estructura básica HTML para la impresión
        printWindow.document.write(`
          <html>
            <head>
              <title>Detalle de Venta</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h3, h2 { text-align: center; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
                .img-fluid { max-width: 100%; height: auto; margin: 10px 0; }
              </style>
            </head>
            <body>
              <h2>Detalle de Venta Indumentaria</h2>
              <h3>Instructor: ${getFullName(this.dataval.instructor)}</h3>
              
              <table>
                <thead>
                  <tr>
                    <th>Indumentaria</th>
                    <th>Cantidad</th>
                    <th>Talla</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${this.dataval.detalles.map((item: any) => `
                    <tr>
                      <td>
                        ${item.indumentaria.nombre} (${item.indumentaria.codigo_producto})<br>
                    
                      </td>
                      <td>${item.cantidad}</td>
                             <td>${item.talla}</td>
                      <td>${item.precio}</td>
                      <td>${item.total}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td><strong>Estado</strong> :</td>
                    <td>${this.dataval.estado}</td>
                    <td><strong>Total</strong> :</td>
                    <td>${this.dataval.total.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
    
              ${this.dataval.imagen ? `<h3>Comprobante de Venta</h3><img src="${this.dataval.imagen}" class="img-fluid" />` : ''}
              
              <h2>${this.dataval.descripcion}</h2>
            </body>
          </html>
        `);
    
        // Esperar a que se cargue el contenido y luego ejecutar la impresión
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }
    }
  
}

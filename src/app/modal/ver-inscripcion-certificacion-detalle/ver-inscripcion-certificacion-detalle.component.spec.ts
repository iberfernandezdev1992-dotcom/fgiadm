import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInscripcionCertificacionDetalleComponent } from './ver-inscripcion-certificacion-detalle.component';

describe('VerInscripcionCertificacionDetalleComponent', () => {
  let component: VerInscripcionCertificacionDetalleComponent;
  let fixture: ComponentFixture<VerInscripcionCertificacionDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerInscripcionCertificacionDetalleComponent]
    });
    fixture = TestBed.createComponent(VerInscripcionCertificacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

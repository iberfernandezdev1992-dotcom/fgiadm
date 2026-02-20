import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInscripcionTallerDetalleComponent } from './ver-inscripcion-taller-detalle.component';

describe('VerInscripcionTallerDetalleComponent', () => {
  let component: VerInscripcionTallerDetalleComponent;
  let fixture: ComponentFixture<VerInscripcionTallerDetalleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerInscripcionTallerDetalleComponent]
    });
    fixture = TestBed.createComponent(VerInscripcionTallerDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

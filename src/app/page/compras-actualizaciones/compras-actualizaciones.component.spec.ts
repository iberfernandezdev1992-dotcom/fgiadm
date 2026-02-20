import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComprasActualizacionesComponent } from './compras-actualizaciones.component';

describe('ComprasActualizacionesComponent', () => {
  let component: ComprasActualizacionesComponent;
  let fixture: ComponentFixture<ComprasActualizacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ComprasActualizacionesComponent]
    });
    fixture = TestBed.createComponent(ComprasActualizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

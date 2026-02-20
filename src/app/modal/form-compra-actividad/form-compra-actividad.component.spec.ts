import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCompraActividadComponent } from './form-compra-actividad.component';

describe('FormCompraActividadComponent', () => {
  let component: FormCompraActividadComponent;
  let fixture: ComponentFixture<FormCompraActividadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormCompraActividadComponent]
    });
    fixture = TestBed.createComponent(FormCompraActividadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

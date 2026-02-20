import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVentaIndumentariaComponent } from './form-venta-indumentaria.component';

describe('FormVentaIndumentariaComponent', () => {
  let component: FormVentaIndumentariaComponent;
  let fixture: ComponentFixture<FormVentaIndumentariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormVentaIndumentariaComponent]
    });
    fixture = TestBed.createComponent(FormVentaIndumentariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

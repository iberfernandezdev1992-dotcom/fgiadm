import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCertificacionComponent } from './form-certificacion.component';

describe('FormCertificacionComponent', () => {
  let component: FormCertificacionComponent;
  let fixture: ComponentFixture<FormCertificacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormCertificacionComponent]
    });
    fixture = TestBed.createComponent(FormCertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

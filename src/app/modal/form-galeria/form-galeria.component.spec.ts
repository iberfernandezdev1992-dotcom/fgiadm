import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGaleriaComponent } from './form-galeria.component';

describe('FormGaleriaComponent', () => {
  let component: FormGaleriaComponent;
  let fixture: ComponentFixture<FormGaleriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormGaleriaComponent]
    });
    fixture = TestBed.createComponent(FormGaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

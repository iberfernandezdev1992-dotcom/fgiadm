import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormGastoComponent } from './form-gasto.component';

describe('FormGastoComponent', () => {
  let component: FormGastoComponent;
  let fixture: ComponentFixture<FormGastoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormGastoComponent]
    });
    fixture = TestBed.createComponent(FormGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

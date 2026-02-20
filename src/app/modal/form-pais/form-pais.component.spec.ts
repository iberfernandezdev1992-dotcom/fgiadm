import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPaisComponent } from './form-pais.component';

describe('FormPaisComponent', () => {
  let component: FormPaisComponent;
  let fixture: ComponentFixture<FormPaisComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormPaisComponent]
    });
    fixture = TestBed.createComponent(FormPaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormExamenComponent } from './form-examen.component';

describe('FormExamenComponent', () => {
  let component: FormExamenComponent;
  let fixture: ComponentFixture<FormExamenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormExamenComponent]
    });
    fixture = TestBed.createComponent(FormExamenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

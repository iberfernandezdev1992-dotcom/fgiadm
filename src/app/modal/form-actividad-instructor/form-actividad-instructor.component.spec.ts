import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormActividadInstructorComponent } from './form-actividad-instructor.component';

describe('FormActividadInstructorComponent', () => {
  let component: FormActividadInstructorComponent;
  let fixture: ComponentFixture<FormActividadInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormActividadInstructorComponent]
    });
    fixture = TestBed.createComponent(FormActividadInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

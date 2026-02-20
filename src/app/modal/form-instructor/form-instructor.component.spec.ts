import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInstructorComponent } from './form-instructor.component';

describe('FormInstructorComponent', () => {
  let component: FormInstructorComponent;
  let fixture: ComponentFixture<FormInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormInstructorComponent]
    });
    fixture = TestBed.createComponent(FormInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

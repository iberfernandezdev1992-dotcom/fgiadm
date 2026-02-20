import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerInstructorComponent } from './ver-instructor.component';

describe('VerInstructorComponent', () => {
  let component: VerInstructorComponent;
  let fixture: ComponentFixture<VerInstructorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerInstructorComponent]
    });
    fixture = TestBed.createComponent(VerInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

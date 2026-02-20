import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRangoComponent } from './form-rango.component';

describe('FormRangoComponent', () => {
  let component: FormRangoComponent;
  let fixture: ComponentFixture<FormRangoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormRangoComponent]
    });
    fixture = TestBed.createComponent(FormRangoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

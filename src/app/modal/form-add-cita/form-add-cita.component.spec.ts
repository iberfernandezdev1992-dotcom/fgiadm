import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAddCitaComponent } from './form-add-cita.component';

describe('FormAddCitaComponent', () => {
  let component: FormAddCitaComponent;
  let fixture: ComponentFixture<FormAddCitaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormAddCitaComponent]
    });
    fixture = TestBed.createComponent(FormAddCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

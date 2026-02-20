import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormVolumenComponent } from './form-volumen.component';

describe('FormVolumenComponent', () => {
  let component: FormVolumenComponent;
  let fixture: ComponentFixture<FormVolumenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormVolumenComponent]
    });
    fixture = TestBed.createComponent(FormVolumenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

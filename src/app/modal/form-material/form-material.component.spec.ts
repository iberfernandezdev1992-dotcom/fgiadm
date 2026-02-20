import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMaterialComponent } from './form-material.component';

describe('FormMaterialComponent', () => {
  let component: FormMaterialComponent;
  let fixture: ComponentFixture<FormMaterialComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormMaterialComponent]
    });
    fixture = TestBed.createComponent(FormMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

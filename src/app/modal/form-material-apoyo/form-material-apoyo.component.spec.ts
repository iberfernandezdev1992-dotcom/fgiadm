import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMaterialApoyoComponent } from './form-material-apoyo.component';

describe('FormMaterialApoyoComponent', () => {
  let component: FormMaterialApoyoComponent;
  let fixture: ComponentFixture<FormMaterialApoyoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormMaterialApoyoComponent]
    });
    fixture = TestBed.createComponent(FormMaterialApoyoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

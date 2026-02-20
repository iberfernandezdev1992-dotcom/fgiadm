import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormIndumentariaComponent } from './form-indumentaria.component';

describe('FormIndumentariaComponent', () => {
  let component: FormIndumentariaComponent;
  let fixture: ComponentFixture<FormIndumentariaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormIndumentariaComponent]
    });
    fixture = TestBed.createComponent(FormIndumentariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

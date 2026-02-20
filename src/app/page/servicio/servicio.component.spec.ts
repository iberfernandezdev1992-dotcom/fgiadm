import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicioComponent } from './servicio.component';

describe('ServicioComponent', () => {
  let component: ServicioComponent;
  let fixture: ComponentFixture<ServicioComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServicioComponent]
    });
    fixture = TestBed.createComponent(ServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

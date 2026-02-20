import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerVentaComponent } from './ver-venta.component';

describe('VerVentaComponent', () => {
  let component: VerVentaComponent;
  let fixture: ComponentFixture<VerVentaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerVentaComponent]
    });
    fixture = TestBed.createComponent(VerVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

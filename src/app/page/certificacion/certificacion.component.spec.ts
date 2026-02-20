import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificacionComponent } from './certificacion.component';

describe('CertificacionComponent', () => {
  let component: CertificacionComponent;
  let fixture: ComponentFixture<CertificacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CertificacionComponent]
    });
    fixture = TestBed.createComponent(CertificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangoComponent } from './rango.component';

describe('RangoComponent', () => {
  let component: RangoComponent;
  let fixture: ComponentFixture<RangoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangoComponent]
    });
    fixture = TestBed.createComponent(RangoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogComponentEx } from './confirm.component';

describe('ConfirmComponent', () => {
  let component: ConfirmDialogComponentEx;
  let fixture: ComponentFixture<ConfirmDialogComponentEx>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponentEx]
    });
    fixture = TestBed.createComponent(ConfirmDialogComponentEx);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

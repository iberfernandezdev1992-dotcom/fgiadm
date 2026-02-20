/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ActividadShowComponent } from './actividad-show.component';

describe('ActividadShowComponent', () => {
  let component: ActividadShowComponent;
  let fixture: ComponentFixture<ActividadShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActividadShowComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActividadShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerProgramaComponent } from './ver-programa.component';

describe('VerProgramaComponent', () => {
  let component: VerProgramaComponent;
  let fixture: ComponentFixture<VerProgramaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerProgramaComponent]
    });
    fixture = TestBed.createComponent(VerProgramaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

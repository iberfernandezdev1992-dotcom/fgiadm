import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPreguntasRespuestasComponent } from './ver-preguntas-respuestas.component';

describe('VerPreguntasRespuestasComponent', () => {
  let component: VerPreguntasRespuestasComponent;
  let fixture: ComponentFixture<VerPreguntasRespuestasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerPreguntasRespuestasComponent]
    });
    fixture = TestBed.createComponent(VerPreguntasRespuestasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

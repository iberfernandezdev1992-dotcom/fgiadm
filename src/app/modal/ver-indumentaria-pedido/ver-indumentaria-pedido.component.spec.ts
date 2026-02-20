import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerIndumentariaPedidoComponent } from './ver-indumentaria-pedido.component';

describe('VerIndumentariaPedidoComponent', () => {
  let component: VerIndumentariaPedidoComponent;
  let fixture: ComponentFixture<VerIndumentariaPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerIndumentariaPedidoComponent]
    });
    fixture = TestBed.createComponent(VerIndumentariaPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

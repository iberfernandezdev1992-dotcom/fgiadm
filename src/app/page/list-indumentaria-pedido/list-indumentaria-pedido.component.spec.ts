import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListIndumentariaPedidoComponent } from './list-indumentaria-pedido.component';

describe('ListIndumentariaPedidoComponent', () => {
  let component: ListIndumentariaPedidoComponent;
  let fixture: ComponentFixture<ListIndumentariaPedidoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListIndumentariaPedidoComponent]
    });
    fixture = TestBed.createComponent(ListIndumentariaPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

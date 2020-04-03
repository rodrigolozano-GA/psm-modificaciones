import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoDetalleRecepcionComponent } from './dialogo-detalle-recepcion.component';

describe('DialogoDetalleRecepcionComponent', () => {
  let component: DialogoDetalleRecepcionComponent;
  let fixture: ComponentFixture<DialogoDetalleRecepcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoDetalleRecepcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoDetalleRecepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

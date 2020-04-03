import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoDetalleActasComponent } from './dialogo-detalle-actas.component';

describe('DialogoDetalleActasComponent', () => {
  let component: DialogoDetalleActasComponent;
  let fixture: ComponentFixture<DialogoDetalleActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoDetalleActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoDetalleActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

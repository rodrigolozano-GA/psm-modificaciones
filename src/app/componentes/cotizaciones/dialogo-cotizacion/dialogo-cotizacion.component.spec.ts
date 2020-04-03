import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCotizacionComponent } from './dialogo-cotizacion.component';

describe('DialogoCotizacionComponent', () => {
  let component: DialogoCotizacionComponent;
  let fixture: ComponentFixture<DialogoCotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

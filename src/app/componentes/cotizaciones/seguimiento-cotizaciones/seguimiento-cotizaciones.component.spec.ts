import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoCotizacionesComponent } from './seguimiento-cotizaciones.component';

describe('SeguimientoCotizacionesComponent', () => {
  let component: SeguimientoCotizacionesComponent;
  let fixture: ComponentFixture<SeguimientoCotizacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoCotizacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

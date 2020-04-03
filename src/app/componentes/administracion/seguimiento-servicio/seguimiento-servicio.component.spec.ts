import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoServicioComponent } from './seguimiento-servicio.component';

describe('SeguimientoServicioComponent', () => {
  let component: SeguimientoServicioComponent;
  let fixture: ComponentFixture<SeguimientoServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

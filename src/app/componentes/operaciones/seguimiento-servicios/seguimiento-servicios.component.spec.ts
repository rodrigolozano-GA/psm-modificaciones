import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoServiciosComponent } from './seguimiento-servicios.component';

describe('SeguimientoServiciosComponent', () => {
  let component: SeguimientoServiciosComponent;
  let fixture: ComponentFixture<SeguimientoServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

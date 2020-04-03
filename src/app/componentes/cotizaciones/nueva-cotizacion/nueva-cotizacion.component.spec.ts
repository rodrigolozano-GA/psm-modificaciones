import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCotizacionComponent } from './nueva-cotizacion.component';

describe('NuevaCotizacionComponent', () => {
  let component: NuevaCotizacionComponent;
  let fixture: ComponentFixture<NuevaCotizacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevaCotizacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaCotizacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

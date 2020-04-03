import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoGastosComponent } from './seguimiento-gastos.component';

describe('SeguimientoGastosComponent', () => {
  let component: SeguimientoGastosComponent;
  let fixture: ComponentFixture<SeguimientoGastosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoGastosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

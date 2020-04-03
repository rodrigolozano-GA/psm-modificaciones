import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoGeneralesComponent } from './seguimiento-generales.component';

describe('SeguimientoGeneralesComponent', () => {
  let component: SeguimientoGeneralesComponent;
  let fixture: ComponentFixture<SeguimientoGeneralesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoGeneralesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

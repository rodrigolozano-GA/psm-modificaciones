import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoFoliosComponent } from './seguimiento-folios.component';

describe('SeguimientoFoliosComponent', () => {
  let component: SeguimientoFoliosComponent;
  let fixture: ComponentFixture<SeguimientoFoliosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoFoliosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoFoliosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

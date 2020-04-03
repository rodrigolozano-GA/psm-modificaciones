import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSeleccionServiciosComponent } from './dialogo-seleccion-servicios.component';

describe('DialogoSeleccionServiciosComponent', () => {
  let component: DialogoSeleccionServiciosComponent;
  let fixture: ComponentFixture<DialogoSeleccionServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoSeleccionServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoSeleccionServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

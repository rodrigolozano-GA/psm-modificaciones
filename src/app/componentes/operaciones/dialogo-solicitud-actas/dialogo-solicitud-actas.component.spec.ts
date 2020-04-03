import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSolicitudActasComponent } from './dialogo-solicitud-actas.component';

describe('DialogoSolicitudActasComponent', () => {
  let component: DialogoSolicitudActasComponent;
  let fixture: ComponentFixture<DialogoSolicitudActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoSolicitudActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoSolicitudActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

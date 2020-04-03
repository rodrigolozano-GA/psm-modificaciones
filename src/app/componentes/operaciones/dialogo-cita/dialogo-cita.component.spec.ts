import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCitaComponent } from './dialogo-cita.component';

describe('DialogoCitaComponent', () => {
  let component: DialogoCitaComponent;
  let fixture: ComponentFixture<DialogoCitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

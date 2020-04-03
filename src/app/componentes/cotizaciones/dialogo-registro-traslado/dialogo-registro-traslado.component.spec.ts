import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoRegistroTrasladoComponent } from './dialogo-registro-traslado.component';

describe('DialogoRegistroTrasladoComponent', () => {
  let component: DialogoRegistroTrasladoComponent;
  let fixture: ComponentFixture<DialogoRegistroTrasladoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoRegistroTrasladoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoRegistroTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

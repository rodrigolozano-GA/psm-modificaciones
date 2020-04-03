import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoDividirMontoComponent } from './dialogo-dividir-monto.component';

describe('DialogoDividirMontoComponent', () => {
  let component: DialogoDividirMontoComponent;
  let fixture: ComponentFixture<DialogoDividirMontoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoDividirMontoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoDividirMontoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

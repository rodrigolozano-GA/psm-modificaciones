import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoConfirmacionesComponent } from './dialogo-confirmaciones.component';

describe('DialogoConfirmacionesComponent', () => {
  let component: DialogoConfirmacionesComponent;
  let fixture: ComponentFixture<DialogoConfirmacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoConfirmacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoConfirmacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

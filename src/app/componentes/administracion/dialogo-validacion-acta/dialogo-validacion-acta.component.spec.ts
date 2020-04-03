import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoValidacionActaComponent } from './dialogo-validacion-acta.component';

describe('DialogoValidacionActaComponent', () => {
  let component: DialogoValidacionActaComponent;
  let fixture: ComponentFixture<DialogoValidacionActaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoValidacionActaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoValidacionActaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

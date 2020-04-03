import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoTecnicoComponent } from './dialogo-tecnico.component';

describe('DialogoTecnicoComponent', () => {
  let component: DialogoTecnicoComponent;
  let fixture: ComponentFixture<DialogoTecnicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoTecnicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoTecnicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

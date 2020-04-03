import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoSucursalComponent } from './dialogo-sucursal.component';

describe('DialogoSucursalComponent', () => {
  let component: DialogoSucursalComponent;
  let fixture: ComponentFixture<DialogoSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

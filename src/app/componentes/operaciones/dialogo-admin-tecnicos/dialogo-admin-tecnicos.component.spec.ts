import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAdminTecnicosComponent } from './dialogo-admin-tecnicos.component';

describe('DialogoAdminTecnicosComponent', () => {
  let component: DialogoAdminTecnicosComponent;
  let fixture: ComponentFixture<DialogoAdminTecnicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoAdminTecnicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAdminTecnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoInformacionComponent } from './dialogo-informacion.component';

describe('DialogoInformacionComponent', () => {
  let component: DialogoInformacionComponent;
  let fixture: ComponentFixture<DialogoInformacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoInformacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoRegistroViaticosComponent } from './dialogo-registro-viaticos.component';

describe('DialogoRegistroViaticosComponent', () => {
  let component: DialogoRegistroViaticosComponent;
  let fixture: ComponentFixture<DialogoRegistroViaticosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoRegistroViaticosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoRegistroViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

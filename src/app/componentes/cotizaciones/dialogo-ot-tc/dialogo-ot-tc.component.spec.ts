import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoOtTcComponent } from './dialogo-ot-tc.component';

describe('DialogoOtTcComponent', () => {
  let component: DialogoOtTcComponent;
  let fixture: ComponentFixture<DialogoOtTcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoOtTcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoOtTcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

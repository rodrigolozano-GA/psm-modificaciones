import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoGastoComponent } from './dialogo-gasto.component';

describe('DialogoGastoComponent', () => {
  let component: DialogoGastoComponent;
  let fixture: ComponentFixture<DialogoGastoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoGastoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

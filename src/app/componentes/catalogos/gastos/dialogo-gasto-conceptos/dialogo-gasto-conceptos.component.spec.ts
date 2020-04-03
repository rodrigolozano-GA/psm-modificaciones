import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoGastoConceptosComponent } from './dialogo-gasto-conceptos.component';

describe('DialogoGastoConceptosComponent', () => {
  let component: DialogoGastoConceptosComponent;
  let fixture: ComponentFixture<DialogoGastoConceptosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoGastoConceptosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoGastoConceptosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

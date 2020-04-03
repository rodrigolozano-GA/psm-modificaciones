import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoAgregarConceptoComponent } from './dialogo-agregar-concepto.component';

describe('DialogoAgregarConceptoComponent', () => {
  let component: DialogoAgregarConceptoComponent;
  let fixture: ComponentFixture<DialogoAgregarConceptoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoAgregarConceptoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoAgregarConceptoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

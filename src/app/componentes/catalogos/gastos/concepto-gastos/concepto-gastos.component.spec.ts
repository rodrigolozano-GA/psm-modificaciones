import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConceptoGastosComponent } from './concepto-gastos.component';

describe('ConceptoGastosComponent', () => {
  let component: ConceptoGastosComponent;
  let fixture: ComponentFixture<ConceptoGastosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConceptoGastosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConceptoGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoGastosComponent } from './catalogo-gastos.component';

describe('CatalogoGastosComponent', () => {
  let component: CatalogoGastosComponent;
  let fixture: ComponentFixture<CatalogoGastosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CatalogoGastosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CatalogoGastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

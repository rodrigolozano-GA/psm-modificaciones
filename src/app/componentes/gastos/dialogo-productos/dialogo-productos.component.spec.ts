import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoProductosComponent } from './dialogo-productos.component';

describe('DialogoProductosComponent', () => {
  let component: DialogoProductosComponent;
  let fixture: ComponentFixture<DialogoProductosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoProductosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

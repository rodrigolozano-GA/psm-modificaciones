import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoServiciosComponent } from './dialogo-servicios.component';

describe('DialogoServiciosComponent', () => {
  let component: DialogoServiciosComponent;
  let fixture: ComponentFixture<DialogoServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

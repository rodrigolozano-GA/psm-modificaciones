import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisServiciosComponent } from './mis-servicios.component';

describe('MisServiciosComponent', () => {
  let component: MisServiciosComponent;
  let fixture: ComponentFixture<MisServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

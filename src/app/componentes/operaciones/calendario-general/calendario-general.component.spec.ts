import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarioGeneralComponent } from './calendario-general.component';

describe('CalendarioGeneralComponent', () => {
  let component: CalendarioGeneralComponent;
  let fixture: ComponentFixture<CalendarioGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarioGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

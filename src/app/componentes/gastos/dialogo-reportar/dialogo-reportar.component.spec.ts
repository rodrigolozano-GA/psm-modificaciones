import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoReportarComponent } from './dialogo-reportar.component';

describe('DialogoReportarComponent', () => {
  let component: DialogoReportarComponent;
  let fixture: ComponentFixture<DialogoReportarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoReportarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoReportarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

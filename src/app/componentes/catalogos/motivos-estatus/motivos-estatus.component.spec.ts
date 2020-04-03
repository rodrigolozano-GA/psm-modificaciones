import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivosEstatusComponent } from './motivos-estatus.component';

describe('MotivosEstatusComponent', () => {
  let component: MotivosEstatusComponent;
  let fixture: ComponentFixture<MotivosEstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivosEstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivosEstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

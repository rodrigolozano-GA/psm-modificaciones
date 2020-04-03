import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionActasComponent } from './recepcion-actas.component';

describe('RecepcionActasComponent', () => {
  let component: RecepcionActasComponent;
  let fixture: ComponentFixture<RecepcionActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecepcionActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

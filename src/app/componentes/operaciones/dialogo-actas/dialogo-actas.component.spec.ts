import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoActasComponent } from './dialogo-actas.component';

describe('DialogoActasComponent', () => {
  let component: DialogoActasComponent;
  let fixture: ComponentFixture<DialogoActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoMotivosComponent } from './dialogo-motivos.component';

describe('DialogoMotivosComponent', () => {
  let component: DialogoMotivosComponent;
  let fixture: ComponentFixture<DialogoMotivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoMotivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoMotivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

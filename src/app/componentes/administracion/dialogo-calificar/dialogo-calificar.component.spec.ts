import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoCalificarComponent } from './dialogo-calificar.component';

describe('DialogoCalificarComponent', () => {
  let component: DialogoCalificarComponent;
  let fixture: ComponentFixture<DialogoCalificarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoCalificarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoCalificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

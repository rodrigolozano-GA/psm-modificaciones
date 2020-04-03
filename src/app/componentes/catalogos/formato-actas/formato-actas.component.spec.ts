import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormatoActasComponent } from './formato-actas.component';

describe('FormatoActasComponent', () => {
  let component: FormatoActasComponent;
  let fixture: ComponentFixture<FormatoActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormatoActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormatoActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArmadoActasComponent } from './armado-actas.component';

describe('ArmadoActasComponent', () => {
  let component: ArmadoActasComponent;
  let fixture: ComponentFixture<ArmadoActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArmadoActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArmadoActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

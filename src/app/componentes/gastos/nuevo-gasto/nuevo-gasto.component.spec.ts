import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoGastoComponent } from './nuevo-gasto.component';

describe('NuevoGastoComponent', () => {
  let component: NuevoGastoComponent;
  let fixture: ComponentFixture<NuevoGastoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoGastoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoGastoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

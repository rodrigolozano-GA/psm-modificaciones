import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizarActasComponent } from './autorizar-actas.component';

describe('AutorizarActasComponent', () => {
  let component: AutorizarActasComponent;
  let fixture: ComponentFixture<AutorizarActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizarActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizarActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

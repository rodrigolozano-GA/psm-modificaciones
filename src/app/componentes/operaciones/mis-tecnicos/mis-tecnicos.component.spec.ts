import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisTecnicosComponent } from './mis-tecnicos.component';

describe('MisTecnicosComponent', () => {
  let component: MisTecnicosComponent;
  let fixture: ComponentFixture<MisTecnicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisTecnicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisTecnicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

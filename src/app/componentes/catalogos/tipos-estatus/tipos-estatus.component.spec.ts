import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TiposEstatusComponent } from './tipos-estatus.component';

describe('TiposEstatusComponent', () => {
  let component: TiposEstatusComponent;
  let fixture: ComponentFixture<TiposEstatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TiposEstatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TiposEstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

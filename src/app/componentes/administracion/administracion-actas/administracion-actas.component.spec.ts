import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionActasComponent } from './administracion-actas.component';

describe('AdministracionActasComponent', () => {
  let component: AdministracionActasComponent;
  let fixture: ComponentFixture<AdministracionActasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdministracionActasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionActasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

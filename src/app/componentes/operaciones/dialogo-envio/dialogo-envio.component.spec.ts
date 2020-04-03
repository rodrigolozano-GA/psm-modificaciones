import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoEnvioComponent } from './dialogo-envio.component';

describe('DialogoEnvioComponent', () => {
  let component: DialogoEnvioComponent;
  let fixture: ComponentFixture<DialogoEnvioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoEnvioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoEnvioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

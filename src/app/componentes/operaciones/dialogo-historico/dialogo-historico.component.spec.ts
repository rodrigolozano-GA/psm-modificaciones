import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoHistoricoComponent } from './dialogo-historico.component';

describe('DialogoHistoricoComponent', () => {
  let component: DialogoHistoricoComponent;
  let fixture: ComponentFixture<DialogoHistoricoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoHistoricoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

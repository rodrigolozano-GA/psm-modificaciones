import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoImportadorComponent } from './dialogo-importador.component';

describe('DialogoImportadorComponent', () => {
  let component: DialogoImportadorComponent;
  let fixture: ComponentFixture<DialogoImportadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoImportadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoImportadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

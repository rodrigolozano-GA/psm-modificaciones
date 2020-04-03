import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoFolioComponent } from './dialogo-folio.component';

describe('DialogoFolioComponent', () => {
  let component: DialogoFolioComponent;
  let fixture: ComponentFixture<DialogoFolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogoFolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogoFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

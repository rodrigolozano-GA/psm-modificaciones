import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoFolioComponent } from './nuevo-folio.component';

describe('NuevoFolioComponent', () => {
  let component: NuevoFolioComponent;
  let fixture: ComponentFixture<NuevoFolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuevoFolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevoFolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

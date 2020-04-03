import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorpassComponent } from './importadorpass.component';

describe('ImportadorpassComponent', () => {
  let component: ImportadorpassComponent;
  let fixture: ComponentFixture<ImportadorpassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorpassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorpassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

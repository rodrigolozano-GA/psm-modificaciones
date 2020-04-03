import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadorComponent } from './importador.component';

describe('ImportadorComponent', () => {
  let component: ImportadorComponent;
  let fixture: ComponentFixture<ImportadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

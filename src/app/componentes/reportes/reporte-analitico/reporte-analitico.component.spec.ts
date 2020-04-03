import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAnaliticoComponent } from './reporte-analitico.component';

describe('ReporteAnaliticoComponent', () => {
  let component: ReporteAnaliticoComponent;
  let fixture: ComponentFixture<ReporteAnaliticoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteAnaliticoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAnaliticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

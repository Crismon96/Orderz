import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableChartComponent } from './datatable-chart.component';

describe('DatatableChartComponent', () => {
  let component: DatatableChartComponent;
  let fixture: ComponentFixture<DatatableChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatatableChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

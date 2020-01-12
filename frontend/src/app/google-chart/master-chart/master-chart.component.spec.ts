import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterChartComponent } from './master-chart.component';

describe('MasterChartComponent', () => {
  let component: MasterChartComponent;
  let fixture: ComponentFixture<MasterChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MasterChartComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterChartComponent } from './master-chart/master-chart.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [MasterChartComponent],
  imports: [CommonModule, HttpClientModule],
  exports: [MasterChartComponent],
})
export class GoogleChartModule {}

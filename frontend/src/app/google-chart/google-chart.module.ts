import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterChartComponent } from './master-chart/master-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatSelectModule } from '@angular/material';

@NgModule({
  declarations: [MasterChartComponent],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule, MatSelectModule, MatButtonModule],
  exports: [MasterChartComponent],
})
export class GoogleChartModule {}

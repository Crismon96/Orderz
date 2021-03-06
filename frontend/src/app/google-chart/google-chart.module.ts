import { NgModule } from '@angular/core';
import { MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { MasterChartComponent } from './master-chart/master-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatatableChartComponent } from './master-chart/chart-components/datatable-chart/datatable-chart.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [MasterChartComponent, DatatableChartComponent],
  imports: [IonicModule, CommonModule, HttpClientModule, ReactiveFormsModule, FormsModule, MatTableModule, MatPaginatorModule, MatSortModule],
  exports: [MasterChartComponent],
})
export class GoogleChartModule {}

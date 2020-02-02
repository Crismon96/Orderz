import { NgModule } from '@angular/core';
import { MatInputModule, MatFormFieldModule, MatTableModule, MatButtonModule, MatSelectModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { MasterChartComponent } from './master-chart/master-chart.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatatableChartComponent } from './master-chart/chart-components/datatable-chart/datatable-chart.component';

@NgModule({
  declarations: [MasterChartComponent, DatatableChartComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  exports: [MasterChartComponent],
})
export class GoogleChartModule {}

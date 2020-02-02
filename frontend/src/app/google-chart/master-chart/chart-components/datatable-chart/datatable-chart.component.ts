import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ICollectionInfo } from '../../../../../shared/IcollectionInfo';
import { GoogleChartService } from '../../../google-chart.service';
import { Dataset } from '../../../../../shared/Icollection';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-datatable-chart',
  templateUrl: './datatable-chart.component.html',
  styleUrls: ['./datatable-chart.component.scss'],
})
export class DatatableChartComponent implements OnInit {
  @Input() activeCollection: ICollectionInfo;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Output() noValidDataReceived: EventEmitter<void> = new EventEmitter();

  constructor(private gChart: GoogleChartService) {}

  displayedColumns: string[] = ['title', 'data', 'dataType', 'submissionDate'];
  dataSource = new MatTableDataSource<Dataset>();

  ngOnInit() {
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe(wholeData => {
      if (wholeData.length === 0) {
        this.noValidDataReceived.emit();
      } else {
        this.dataSource.data = wholeData;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }
}

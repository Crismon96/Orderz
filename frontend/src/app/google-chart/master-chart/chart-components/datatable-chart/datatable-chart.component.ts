import { Component, Input, OnInit } from '@angular/core';
import { ICollectionInfo } from '../../../../../shared/IcollectionInfo';
import { GoogleChartService } from '../../../google-chart.service';
import { Dataset } from '../../../../../shared/Icollection';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-datatable-chart',
  templateUrl: './datatable-chart.component.html',
  styleUrls: ['./datatable-chart.component.scss'],
})
export class DatatableChartComponent implements OnInit {
  @Input() activeCollection: ICollectionInfo;
  constructor(private gChart: GoogleChartService) {}

  displayedColumns: string[] = ['title', 'data', 'dataType', 'submissionDate'];
  dataSource: Dataset[];

  ngOnInit() {
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe(wholeData => {
      this.dataSource = wholeData;
    });
  }
}

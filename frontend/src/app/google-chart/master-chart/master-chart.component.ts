import {Component, OnDestroy, OnInit} from '@angular/core';
import { GoogleChartService } from '../google-chart.service';
import { LibraryService } from '../../../services/library.service';
import { ICollectionConfig, ICollectionInfo } from '../../../shared/IcollectionInfo';
import { Dataset } from '../../../shared/Icollection';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-master-chart',
  templateUrl: './master-chart.component.html',
  styleUrls: ['./master-chart.component.scss'],
})
export class MasterChartComponent implements OnInit, OnDestroy {
  private gLib: any;
  private activeCollection: ICollectionInfo;
  activeCollectionConfig: ICollectionConfig;
  subscriptions = new Subscription();

  constructor(private gChart: GoogleChartService, private lib: LibraryService) {
    this.gLib = this.gChart.getGoogle();
    this.gLib.charts.load('current', { packages: ['corechart', 'table'] });
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
  }
  ngOnInit() {
    this.subscriptions.add(
      this.lib.activeCollection.subscribe(collection => {
        this.activeCollection = collection;
      })
    );
    this.subscriptions.add(
      this.lib.activeCollectionInfo.subscribe(info => {
        this.activeCollectionConfig = info;
      })
    );
  }

  private drawChart() {
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe((data: Dataset[]) => {
      if (!this.activeCollectionConfig.configuration.find(dataSet => dataSet.dataType !== 'number')) {
        this.drawLineChart(data);
      } else {
        // TODO: add different chart types
      }
    });
  }

  private drawLineChart(data: Dataset[]) {
    const totalArray = [];
    const headerArray = ['Date'];
    for (let i = 0; i < this.activeCollection.numberOfDatasets; i++) {
      headerArray.push(data[i].title);
    }
    totalArray.push(headerArray);

    let dataArray = [];
    for (const dataPoint of data) {
      if (dataArray.length === 0) {
        const parsedDate = new Date(dataPoint.submissionDate);
        dataArray.push(`${parsedDate.getDate()}.${parsedDate.getMonth() + 1}`);
      }
      dataArray.push(dataPoint.data);
      if (dataArray.length > this.activeCollection.numberOfDatasets) {
        totalArray.push(dataArray);
        dataArray = [];
      }
    }
    const chartData = this.gLib.visualization.arrayToDataTable(totalArray);
    const chart = new this.gLib.visualization.LineChart(document.getElementById('divLineChart'));

    const options = { title: `${this.activeCollection.title} - Linechart`, height: 650, is3D: true };
    chart.draw(chartData, options);
  }

  private drawTableChart() {
    const data = new this.gLib.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('number', 'Salary');
    data.addColumn('boolean', 'Full Time Employee');
    data.addRows([
      ['Mike',  {v: 10000, f: '$10,000'}, true],
      ['Jim',   {v: 8000,   f: '$8,000'},  false],
      ['Alice', {v: 12500, f: '$12,500'}, true],
      ['Bob',   {v: 7000,  f: '$7,000'},  true]
    ]);

    const table = new this.gLib.visualization.Table(document.getElementById('divTableChart'));

    table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

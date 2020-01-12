import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from '../google-chart.service';
import { LibraryService } from '../../../services/library.service';
import { ICollectionConfig, ICollectionInfo } from '../../../shared/IcollectionInfo';
import { Dataset } from '../../../shared/Icollection';

@Component({
  selector: 'app-master-chart',
  templateUrl: './master-chart.component.html',
  styleUrls: ['./master-chart.component.scss'],
})
export class MasterChartComponent implements OnInit {
  private gLib: any;
  private activeCollection: ICollectionInfo;
  activeCollectionConfig: ICollectionConfig;

  constructor(private gChart: GoogleChartService, private lib: LibraryService) {
    this.gLib = this.gChart.getGoogle();
    this.gLib.charts.load('current', { packages: ['corechart', 'table'] });
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
  }
  ngOnInit() {
    this.lib.activeCollection.subscribe(collection => {
      this.activeCollection = collection;
    });
    this.lib.activeCollectionInfo.subscribe(info => {
      this.activeCollectionConfig = info;
    });
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
}

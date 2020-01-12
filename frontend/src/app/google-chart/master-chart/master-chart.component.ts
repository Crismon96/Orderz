import { Component, OnInit } from '@angular/core';
import { GoogleChartService } from '../google-chart.service';
import { LibraryService } from '../../../services/library.service';
import { ICollectionInfo } from '../../../shared/IcollectionInfo';
import { Dataset } from '../../../shared/Icollection';

@Component({
  selector: 'app-master-chart',
  templateUrl: './master-chart.component.html',
  styleUrls: ['./master-chart.component.scss'],
})
export class MasterChartComponent implements OnInit {
  private gLib: any;
  private activeCollection: ICollectionInfo;

  constructor(private gChart: GoogleChartService, private lib: LibraryService) {
    this.gLib = this.gChart.getGoogle();
    this.gLib.charts.load('current', { packages: ['corechart', 'table'] });
    this.gLib.charts.setOnLoadCallback(this.drawChart.bind(this));
  }
  ngOnInit() {
    this.lib.activeCollection.subscribe(collection => {
      console.log('collection: ', collection);
      this.activeCollection = collection;
    });
  }

  private drawChart() {
    // TODO: Must sort array for date and then display correctly
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe((data: Dataset[]) => {
      // Topic array
      const totalArray = [];
      const headerArray = ['Date'];
      for (let i = 0; i < this.activeCollection.numberOfDatasets; i++) {
        headerArray.push(data[i].title);
      }
      totalArray.push(headerArray);

      // normal small array
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

      chart.draw(chartData);
    });
  }
}

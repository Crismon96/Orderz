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
      this.activeCollection = collection;
    });
  }

  private drawChart() {
    // TODO: Must sort array for date and then display correctly
    this.gChart.displayCollectionData(this.activeCollection.title)._subscribe((data: Dataset[]) => {
      const data = this.gLib.visualization.arrayToDataTable([['Year', 'First', 'Second', 'Third', 'Fourth'], ...data]);

      const chart = new this.gLib.visualization.LineChart(document.getElementById('divLineChart'));

      chart.draw(data);
    });
  }
}

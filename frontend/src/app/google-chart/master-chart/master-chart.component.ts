import { Component, OnDestroy, OnInit } from '@angular/core';
import { GoogleChartService } from '../google-chart.service';
import { LibraryService } from '../../../services/library.service';
import { ICollectionConfig, ICollectionInfo } from '../../../shared/IcollectionInfo';
import { Dataset } from '../../../shared/Icollection';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

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
  selectedType = 'number';
  types = ['Line-Chart (number)', 'Yes/No-Donut (boolean)', 'Diversified-Donut (selection)', 'Table-Chart (All)'];
  form: FormGroup;

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
    this.form = new FormGroup({
      chartType: new FormControl('number'),
    });
  }

  private drawChart() {
    // TODO:  Draw LineChart initially if numbers exist, else go to other Charttype, but do the Request inside the chart function
    console.log(this.activeCollectionConfig);
    const containsNumbers = this.activeCollectionConfig.configuration.filter(dataset => dataset.dataType === 'number');
    if (containsNumbers.length > 0) {
      this.drawLineChart();
    }
  }

  drawNewChart() {
    const chartType = this.form.get('chartType').value;
    switch (chartType) {
      case 'Table-Chart (All)':
        this.drawTableChart();
        break;
      case 'Line-Chart (number)':
        this.drawLineChart();
        break;
      case 'Yes/No-Donut (boolean)':
        this.drawDonutChart();
        break;
      case 'Diversified-Donut (selection)':
        this.drawDonutChart();
        break;
      default:
        this.displayChartError();
        break;
    }
  }

  private drawLineChart() {
    let numberOfInputs;
    const filteredConfig = this.activeCollectionConfig.configuration.filter(dataset => dataset.dataType === 'number');
    numberOfInputs = filteredConfig.length;
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe((wholeData: Dataset[]) => {
      const data = wholeData.filter(dataset => dataset.dataType === 'number');

      const totalArray = [];
      const headerArray = ['Date'];
      for (let i = 0; i < numberOfInputs; i++) {
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
        if (dataArray.length > numberOfInputs) {
          totalArray.push(dataArray);
          dataArray = [];
        }
      }
      const chartData = this.gLib.visualization.arrayToDataTable(totalArray);
      const chart = new this.gLib.visualization.LineChart(document.getElementById('divLineChart'));

      const options = { title: `${this.activeCollection.title} - Linechart`, height: 650, is3D: true };
      chart.draw(chartData, options);
    });
  }

  private drawTableChart() {
    const data = new this.gLib.visualization.DataTable();
    data.addColumn('string', 'Name');
    data.addColumn('number', 'Salary');
    data.addColumn('boolean', 'Full Time Employee');
    data.addRows([
      ['Mike', { v: 10000, f: '$10,000' }, true],
      ['Jim', { v: 8000, f: '$8,000' }, false],
      ['Alice', { v: 12500, f: '$12,500' }, true],
      ['Bob', { v: 7000, f: '$7,000' }, true],
    ]);

    const table = new this.gLib.visualization.Table(document.getElementById('divTableChart'));

    table.draw(data, { showRowNumber: true, width: '100%', height: '100%' });
  }

  drawDonutChart() {
    const data = this.gLib.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Work', 11],
      ['Eat', 2],
      ['Commute', 2],
      ['Watch TV', 2],
      ['Sleep', 7],
    ]);

    const options = {
      title: 'My Daily Activities',
      pieHole: 0.4,
    };

    const chart = new this.gLib.visualization.PieChart(document.getElementById('divPieChart'));
    chart.draw(data, options);
  }

  displayChartError() {
    console.log('Error happened, show a generic error message');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

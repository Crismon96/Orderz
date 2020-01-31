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
  selectedType = 'Line-Chart (number)';
  types = ['Line-Chart (number)', 'Yes/No-Donut (boolean)', 'Diversified-Donut (selection)', 'Table-Chart (All)'];
  form: FormGroup;
  filterForm: FormGroup;
  activeDataFilter: string;

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
      chartType: new FormControl('Line-Chart (number)'),
    });
    this.filterForm = new FormGroup({
      DonutFilter: new FormControl(),
    });
  }

  saveNewFilter() {
    console.log(this.filterForm.controls.DonutFilter.value);
    this.activeDataFilter = this.filterForm.controls.DonutFilter.value;
    this.drawNewChart();
  }

  private drawChart() {
    // TODO:  Draw LineChart initially if numbers exist, else go to other Charttype, but do the Request inside the chart function
    console.log(this.activeCollectionConfig);
    const containsNumbers = this.activeCollectionConfig.configuration.filter(dataset => dataset.dataType === 'number');
    if (containsNumbers.length > 0) {
      this.drawLineChart();
    } else {
      // Hier DataTable material anzeigen lassen
    }
  }

  drawNewChart() {
    const chartType = this.form.get('chartType').value;
    this.selectedType = chartType;
    switch (chartType) {
      case 'Table-Chart (All)':
        // Hier DataTable anzeigen lassen.
        break;
      case 'Line-Chart (number)':
        this.drawLineChart();
        break;
      case 'Yes/No-Donut (boolean)':
        this.drawDonutChartBool();
        break;
      case 'Diversified-Donut (selection)':
        this.drawDonutChartSelection();
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
    // TODO: Hier methode zum anzeigen des angular Datables
  }

  drawDonutChartSelection() {
    let filteredResults;
    const totalArray: any[] = [['Value', 'Count']];
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe((wholeData: Dataset[]) => {
      filteredResults = wholeData.filter(dataset => dataset.dataType === 'selection');

      if (this.activeDataFilter) {
        filteredResults = filteredResults.filter(dataset => {
          return dataset.title.includes(this.activeDataFilter);
        });
      }

      for (const dataSet of filteredResults) {
        let valueAllreadyExist = false;
        for (const entry of totalArray) {
          if (entry[0] === dataSet.data.toString()) {
            valueAllreadyExist = true;
            entry[1]++;
          }
        }
        if (valueAllreadyExist === false) {
          const newEntry = [dataSet.data.toString(), 1];
          totalArray.push(newEntry);
        }
      }

      const data = this.gLib.visualization.arrayToDataTable(totalArray);
      const options = {
        width: 900,
        height: 900,
        title: 'My Daily Activities',
        pieHole: 0.4,
      };

      const chart = new this.gLib.visualization.PieChart(document.getElementById('divPieChart'));
      chart.draw(data, options);
    });
  }

  drawDonutChartBool() {
    console.log('here comes chart bool');
  }

  displayChartError() {
    console.log('Error happened, show a generic error message');
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

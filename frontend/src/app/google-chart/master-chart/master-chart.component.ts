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
  activeCollection: ICollectionInfo;
  activeCollectionConfig: ICollectionConfig;
  subscriptions = new Subscription();
  selectedType = 'Line-Chart (number)';
  types = ['Line-Chart (number)', 'Yes/No-Donut (boolean)', 'Diversified-Donut (selection)', 'Table-Chart (All)'];
  form: FormGroup;
  filterForm: FormGroup;
  activeDataFilter: string;
  displayChartErrorModal = false;

  constructor(private gChart: GoogleChartService, private lib: LibraryService) {
    this.gLib = this.gChart.getGoogle();
    this.gLib.charts.load('current', { packages: ['corechart', 'bar'] });
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
    this.displayChartErrorModal = false;
    const chartType = this.form.get('chartType').value;
    this.selectedType = chartType;
    switch (chartType) {
      case 'Table-Chart (All)':
        break;
      case 'Line-Chart (number)':
        this.drawLineChart();
        break;
      case 'Yes/No-Donut (boolean)':
        this.drawBarChartBool();
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
      let filteredResults = wholeData.filter(dataset => dataset.dataType === 'number');

      filteredResults = this.applyActiveFilter(filteredResults);
      if (filteredResults.length === 0) {
        this.displayChartErrorModal = true;
        return;
      }

      const totalArray = [];
      const headerArray = ['Date'];
      if (this.activeDataFilter) {
        for (const entry of filteredResults) {
          if (!(headerArray.indexOf(entry.title) > -1)) {
            headerArray.push(entry.title);
          }
        }
        numberOfInputs = headerArray.length - 1;
      } else {
        for (let i = 0; i < numberOfInputs; i++) {
          headerArray.push(filteredResults[i].title);
        }
      }

      totalArray.push(headerArray);
      let dataArray = [];
      for (const dataPoint of filteredResults) {
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

  drawDonutChartSelection() {
    const totalArray: any[] = [['Value', 'Count']];
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe((wholeData: Dataset[]) => {
      let filteredResults = wholeData.filter(dataset => dataset.dataType === 'selection' && dataset.data !== null);

      filteredResults = this.applyActiveFilter(filteredResults);
      if (filteredResults.length === 0) {
        this.displayChartErrorModal = true;
        return;
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
        title: 'My decisions in total',
        pieHole: 0.4,
      };

      const chart = new this.gLib.visualization.PieChart(document.getElementById('divPieChart'));
      chart.draw(data, options);
    });
  }

  drawBarChartBool() {
   // this.gLib.charts.load('current', {'packages':['bar']});
    // google.charts.setOnLoadCallback(drawChart);

    // TODO: Bool chart fertigstellen
    const headerArray = [];
    const filteredConfig = this.activeCollectionConfig.configuration.filter(dataset => dataset.dataType === 'boolean');
    for (const config of filteredConfig) {
      headerArray.push(config.title);
    }
    this.gChart.displayCollectionData(this.activeCollection.title).subscribe((wholeData: Dataset[]) => {

    });


    const data = this.gLib.visualization.arrayToDataTable([
      ['Year', 'Sales', 'Expenses', 'Profit'],
      ['2014', 1000, 400, 200],
      ['2015', 1170, 460, 250],
      ['2016', 660, 1120, 300],
      ['2017', 1030, 540, 350]
    ]);

    const options = {
      chart: {
        title: 'Company Performance',
        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      },
      bars: 'horizontal' // Required for Material Bar Charts.
    };

    const chart = new this.gLib.charts.Bar(document.getElementById('barchart'));

    chart.draw(data, this.gLib.charts.Bar.convertOptions(options));
  }

  displayChartError() {
    this.displayChartErrorModal = true;
    this.selectedType = null;
  }

  applyActiveFilter(data: Dataset[]) {
    if (this.activeDataFilter) {
      return data.filter(dataset => {
        return dataset.title.includes(this.activeDataFilter);
      });
    }
    return data;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

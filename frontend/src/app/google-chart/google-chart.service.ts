import { Injectable } from '@angular/core';
import { GoogleChartModule } from './google-chart.module';
import { HttpClient } from '@angular/common/http';

declare let google: any;
@Injectable({
  providedIn: GoogleChartModule,
})
export class GoogleChartService {
  private google: any;
  constructor(private http: HttpClient) {
    this.google = google;
  }

  getGoogle() {
    return this.google;
  }

  displayCollectionData(collectionName) {
    return this.http.get(`api/data?${collectionName}`);
  }
}

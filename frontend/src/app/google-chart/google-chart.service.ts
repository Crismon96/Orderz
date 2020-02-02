import { Injectable } from '@angular/core';
import { GoogleChartModule } from './google-chart.module';
import { HttpClient } from '@angular/common/http';
import { Dataset } from '../../shared/Icollection';

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

  displayCollectionData(collectionName: string) {
    return this.http.get<Dataset[]>(`api/collections/data?collection=${collectionName}`);
  }
}

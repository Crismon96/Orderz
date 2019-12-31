import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  constructor(private http: HttpClient) {}

  getAllCollections() {
    return this.http.get<string[]>('api/collections');
  }
}

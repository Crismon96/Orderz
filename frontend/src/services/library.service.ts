import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICollectionInfo } from '../shared/IcollectionInfo';
import { ICollection } from '../shared/Icollection';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  constructor(private http: HttpClient) {}

  getAllCollections() {
    return this.http.get<string[]>('api/collections');
  }

  createNewCollection(newCollection: ICollection) {
    console.log(newCollection);
    return this.http.put<ICollectionInfo>('api/collections/create', newCollection);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICollectionInfo } from '../shared/IcollectionInfo';
import { ICollection } from '../shared/Icollection';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  activeCollection = new BehaviorSubject<ICollectionInfo>(null);

  constructor(private http: HttpClient) {}

  getAllCollections() {
    return this.http.get<string[]>('api/collections');
  }

  createNewCollection(newCollection: ICollection) {
    return this.http.put<ICollectionInfo>('api/collections/create', newCollection);
  }

  getCollectionByName(collection: ICollectionInfo) {
    return this.http.get<ICollection>(`api/collections/collection?name=${collection.name}`);
  }
}

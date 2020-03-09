import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICollectionConfig, ICollectionInfo } from '../shared/IcollectionInfo';
import { Dataset, ICollection } from '../shared/Icollection';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  activeCollection = new BehaviorSubject<ICollectionInfo>(null);
  activeCollectionInfo = new BehaviorSubject<ICollectionConfig>(null);

  constructor(private http: HttpClient) {}

  getAllCollections() {
    return this.http.get<ICollectionInfo[]>('api/collections');
  }

  createNewCollection(newCollection: ICollection) {
    return this.http.put<ICollectionInfo>('api/collections/create', newCollection);
  }

  deleteCollection(collection: ICollectionInfo) {
    return this.http.delete<ICollectionInfo>(`api/collections/collection?name=${collection.title}`);
  }

  getCollectionByName(collection: ICollectionInfo) {
    return this.http.get<ICollectionConfig>(`api/collections/collection?name=${collection.title}`);
  }

  submitNewDatapoint(newDatapoint: Dataset[], collection: ICollectionInfo) {
    return this.http.put(`api/collections/datapoint?collection=${collection.title}`, newDatapoint);
  }

  addCollectionToFavorites(newCollection: ICollectionInfo) {
    return this.http.post<ICollectionInfo>('api/collections/favorites', newCollection);
  }
}

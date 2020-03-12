import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICollectionConfig, ICollectionInfo } from '../shared/IcollectionInfo';
import { Dataset, ICollection } from '../shared/Icollection';
import { BehaviorSubject } from 'rxjs';
import { ROUTES } from '../helper/Routes';

@Injectable({
  providedIn: 'root',
})
export class LibraryService {
  activeCollection = new BehaviorSubject<ICollectionInfo>(null);
  activeCollectionInfo = new BehaviorSubject<ICollectionConfig>(null);

  constructor(private http: HttpClient) {}

  getAllCollections() {
    return this.http.get<ICollectionInfo[]>(ROUTES.lib.allCollections);
  }

  createNewCollection(newCollection: ICollection) {
    return this.http.put<ICollectionInfo>(ROUTES.lib.createCollection, newCollection);
  }

  deleteCollection(collection: ICollectionInfo) {
    return this.http.delete<ICollectionInfo>(`${ROUTES.lib.collectionByName}${collection.title}`);
  }

  getCollectionByName(collection: ICollectionInfo) {
    return this.http.get<ICollectionConfig>(`${ROUTES.lib.collectionByName}${collection.title}`);
  }

  submitNewDatapoint(newDatapoint: Dataset[], collection: ICollectionInfo) {
    return this.http.put(`${ROUTES.lib.newDatapoint}${collection.title}`, newDatapoint);
  }

  addCollectionToFavorites(newCollection: ICollectionInfo) {
    return this.http.post<ICollectionInfo>(ROUTES.lib.addFavorite, newCollection);
  }

  getAllFavorites() {
    return this.http.get<ICollectionInfo[]>(ROUTES.lib.getFavorites);
  }
}

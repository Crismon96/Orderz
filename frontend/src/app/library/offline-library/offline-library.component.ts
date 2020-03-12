import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { HeaderService } from '../../../services/header.service';
import { LibraryService } from '../../../services/library.service';
import { ICollectionInfo } from '../../../shared/IcollectionInfo';

@Component({
  selector: 'app-offline-library',
  templateUrl: './offline-library.component.html',
  styleUrls: ['./offline-library.component.scss'],
})
export class OfflineLibraryComponent implements OnInit {
  collections = [];

  constructor(private router: Router, public dialog: MatDialog, private header: HeaderService, private lib: LibraryService) {}

  ngOnInit() {
    this.header.setTitle('Favorites (Offline-Mode)');
    this.lib.getAllFavorites().subscribe(data => {
      console.log('THE OFFLINE DATA: ', data);
      this.collections = data;
    });
  }

  chooseActiveCollection(choosenCollection: ICollectionInfo) {
    this.lib.activeCollection.next(choosenCollection);
    this.header.setTitle(choosenCollection.title);
    this.router.navigateByUrl('libraryOff/collection');
  }

  removeCollection(event: ICollectionInfo) {
    const removedIndex = this.collections.findIndex((collection: ICollectionInfo) => {
      return collection.title === event.title;
    });
    this.collections.splice(removedIndex, 1);
  }
}

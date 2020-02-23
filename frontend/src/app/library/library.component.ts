import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewCollectionModalComponent } from '../../templates/add-new-collection-modal/add-new-collection-modal.component';
import { HeaderService } from '../../services/header.service';
import { LibraryService } from '../../services/library.service';
import { ICollectionInfo } from '../../shared/IcollectionInfo';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  collections = [];

  constructor(private router: Router, public dialog: MatDialog, private header: HeaderService, private lib: LibraryService) {}

  ngOnInit() {
    this.header.setTitle('Library');
    this.lib.getAllCollections().subscribe(data => {
      this.collections = data;
    });
  }

  createNewCollection() {
    const dialogRef = this.dialog.open(AddNewCollectionModalComponent, {
      width: '500px',
      height: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lib.createNewCollection(result).subscribe(() => {
          this.lib.getAllCollections().subscribe(data => {
            this.collections = data;
          });
        });
      }
    });
  }

  chooseActiveCollection(choosenCollection: ICollectionInfo) {
    this.lib.activeCollection.next(choosenCollection);
    this.header.setTitle(choosenCollection.title);
    this.router.navigateByUrl('library/collection');
  }

  removeCollection(event: ICollectionInfo) {
    const removedIndex = this.collections.findIndex((collection: ICollectionInfo) => {
      return collection.title === event.title;
    });
    this.collections.splice(removedIndex, 1);
  }
}

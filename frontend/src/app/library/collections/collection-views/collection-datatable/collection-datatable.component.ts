import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library.service';
import { ICollectionInfo } from '../../../../../shared/IcollectionInfo';
import { ICollection } from '../../../../../shared/Icollection';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-collection-datatable',
  templateUrl: './collection-datatable.component.html',
  styleUrls: ['./collection-datatable.component.scss'],
})
export class CollectionDatatableComponent implements OnInit {
  collection: ICollectionInfo;
  collectionDefinition: ICollection;
  subscriptions = new Subscription();
  constructor(private lib: LibraryService) {}

  ngOnInit() {
    this.subscriptions.add(
      this.lib.activeCollection.subscribe(activeCollection => {
        this.collection = activeCollection;
        this.lib.getCollectionByName(activeCollection).subscribe(result => {
          this.collectionDefinition = result;
          console.log(activeCollection, result);
        });
      })
    );
  }
}

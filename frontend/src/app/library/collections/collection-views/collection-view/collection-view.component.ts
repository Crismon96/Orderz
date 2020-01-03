import { Component, Input, OnInit } from '@angular/core';
import { ICollection } from '../../../../../shared/Icollection';
import { ICollectionInfo } from '../../../../../shared/IcollectionInfo';

@Component({
  selector: 'app-collection-view',
  templateUrl: './collection-view.component.html',
  styleUrls: ['./collection-view.component.scss'],
})
export class CollectionViewComponent implements OnInit {
  @Input() activeCollection: ICollectionInfo;
  displayChoice = 'displayDataTable';
  constructor() {}

  ngOnInit() {}

  displayDataView() {
    this.displayChoice = 'displayDataView';
  }
  displayDataTable() {
    this.displayChoice = 'displayDataTable';
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { ICollectionInfo } from '../../../../shared/IcollectionInfo';

@Component({
  selector: 'app-collection-panel',
  templateUrl: './collection-panel.component.html',
  styleUrls: ['./collection-panel.component.scss'],
})
export class CollectionPanelComponent implements OnInit {
  @Input() collection: ICollectionInfo;
  constructor() {}

  ngOnInit() {}

  openCollection(collection) {
    console.log(collection);
  }
}

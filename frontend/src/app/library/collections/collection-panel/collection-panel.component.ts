import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ICollectionInfo } from '../../../../shared/IcollectionInfo';
import { LibraryService } from '../../../../services/library.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-collection-panel',
  templateUrl: './collection-panel.component.html',
  styleUrls: ['./collection-panel.component.scss'],
})
export class CollectionPanelComponent implements OnInit {
  @Input() collection: ICollectionInfo;
  @Output() clickCollection: EventEmitter<any> = new EventEmitter();
  @Output() collectionWasDeleted: EventEmitter<ICollectionInfo> = new EventEmitter();
  constructor(private lib: LibraryService, public alertController: AlertController) {}

  ngOnInit() {}

  openCollection() {
    this.clickCollection.emit();
  }

  async deleteCollection(collection: ICollectionInfo) {
    const alert = await this.alertController.create({
      header: 'Delete Request',
      message: `Do you really want to delete ${collection.title}? All associated data will be lost.`,
      buttons: [
        {
          text: 'Keep Collection',
          role: 'cancel',
        },
        {
          text: 'DELETE',
          handler: () => {
            this.lib.deleteCollection(collection).subscribe((deleted: ICollectionInfo) => {
              this.collectionWasDeleted.emit(deleted);
            });
          },
        },
      ],
    });

    await alert.present();
  }

  favoriteCollection(collection: ICollectionInfo) {
    this.lib.addCollectionToFavorites(collection).subscribe(res => {
      this.collection = res;
    });
  }
}

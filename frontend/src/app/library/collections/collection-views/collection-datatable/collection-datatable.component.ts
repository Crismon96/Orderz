import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library.service';
import { ICollectionInfo } from '../../../../../shared/IcollectionInfo';
import { Dataset } from '../../../../../shared/Icollection';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-collection-datatable',
  templateUrl: './collection-datatable.component.html',
  styleUrls: ['./collection-datatable.component.scss'],
})
export class CollectionDatatableComponent implements OnInit {
  collection: ICollectionInfo;
  sendDatapointBtnDisabled = false;

  form: FormGroup;
  arrayItems: Dataset[];

  get data() {
    return this.form.get('data') as FormArray;
  }

  constructor(private lib: LibraryService, private formBuilder: FormBuilder, public toastController: ToastController) {
    this.form = this.formBuilder.group({
      data: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.lib.activeCollection.pipe(take(1)).subscribe(activeCollection => {
      this.collection = activeCollection;
      this.lib
        .getCollectionByName(activeCollection)
        .pipe(take(1))
        .subscribe(result => {
          this.lib.activeCollectionInfo.next(result);
          this.arrayItems = result.configuration;
          for (const dataPoint of result.configuration) {
            this.data.push(this.formBuilder.control(undefined));
          }
        });
    });
  }

  resetDatapointForm() {
    this.form.reset();
  }

  createNewDataPoint() {
    this.sendDatapointBtnDisabled = true;
    let positionCounter = 0;
    this.arrayItems.map(dataField => {
      dataField.data = this.form.value.data[positionCounter];
      positionCounter++;
    });
    this.lib.submitNewDatapoint(this.arrayItems, this.collection).subscribe(async result => {
      const toast = await this.toastController.create({
        header: 'Saved',
        message: 'Your data was saved successfully. Close to continue sending.',
        buttons: [
          {
            text: 'Done',
            role: 'cancel',
            handler: () => {
              this.sendDatapointBtnDisabled = false;
            },
          },
        ],
      });
      await toast.present();
    });
  }
}

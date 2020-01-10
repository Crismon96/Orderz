import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library.service';
import { ICollectionConfig, ICollectionInfo } from '../../../../../shared/IcollectionInfo';
import { Dataset } from '../../../../../shared/Icollection';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { take } from 'rxjs/operators';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-collection-datatable',
  templateUrl: './collection-datatable.component.html',
  styleUrls: ['./collection-datatable.component.scss'],
})
export class CollectionDatatableComponent implements OnInit {
  collection: ICollectionInfo;
  collectionDefinition: ICollectionConfig;

  // TODO: Edit Types so they make sense
  types = [1, 2, 3, 4];
  sendDatapointBtnDisabled = false;

  form: FormGroup;
  arrayItems: Dataset[];

  get data() {
    return this.form.get('data') as FormArray;
  }

  constructor(private lib: LibraryService, private formBuilder: FormBuilder, private snackBar: MatSnackBar) {
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
          console.log(result);
          this.collectionDefinition = result;
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
    this.lib.submitNewDatapoint(this.arrayItems, this.collection).subscribe(result => {
      this.snackBar
        .open('Your data was saved successfully. Close to continue sending.', 'close')
        .afterDismissed()
        .subscribe(wasDismissed => {
          this.sendDatapointBtnDisabled = false;
        });
    });
  }
}

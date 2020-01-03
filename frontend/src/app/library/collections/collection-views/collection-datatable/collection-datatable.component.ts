import { Component, OnInit } from '@angular/core';
import { LibraryService } from '../../../../../services/library.service';
import { ICollectionConfig, ICollectionInfo } from '../../../../../shared/IcollectionInfo';
import { Dataset } from '../../../../../shared/Icollection';
import { Subscription } from 'rxjs';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-collection-datatable',
  templateUrl: './collection-datatable.component.html',
  styleUrls: ['./collection-datatable.component.scss'],
})
export class CollectionDatatableComponent implements OnInit {
  collection: ICollectionInfo;
  collectionDefinition: ICollectionConfig;
  subscriptions = new Subscription();
  // TODO: Edit Types so they make sense
  types = [1, 2, 3, 4];

  form: FormGroup;
  arrayItems: Dataset[];

  get data() {
    return this.form.get('data') as FormArray;
  }

  constructor(private lib: LibraryService, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      data: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.subscriptions.add(
      this.lib.activeCollection.subscribe(activeCollection => {
        this.collection = activeCollection;
        this.lib.getCollectionByName(activeCollection).subscribe(result => {
          this.collectionDefinition = result;
          console.log(activeCollection, result);
          this.arrayItems = result.configuration;
          for (const dataPoint of result.configuration) {
            this.data.push(this.formBuilder.control(undefined));
          }
        });
      })
    );
  }

  createNewDataPoint() {
    let positionCounter = 0;
    this.arrayItems.map(dataField => {
      dataField.data = this.form.value.data[positionCounter];
      positionCounter++;
    });
    console.log(this.form.value, 'END RESULT: ', this.arrayItems);
  }
}

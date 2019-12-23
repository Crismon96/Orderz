import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dataset } from '../../shared/Icollection';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AddNewDatasetModalComponent } from '../add-new-dataset-modal/add-new-dataset-modal.component';

@Component({
  selector: 'app-add-new-collection-modal',
  templateUrl: './add-new-collection-modal.component.html',
  styleUrls: ['./add-new-collection-modal.component.scss'],
})
export class AddNewCollectionModalComponent implements OnInit {
  form: FormGroup;
  arrayItems: Dataset[];

  get formArray() {
    return this.form.get('formArray') as FormArray;
  }

  constructor(public dialogRef: MatDialogRef<AddNewCollectionModalComponent>, private formBuilder: FormBuilder, public dialog: MatDialog) {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.arrayItems = [];
  }

  addNewDataset() {
    const dialogRef = this.dialog.open(AddNewDatasetModalComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.arrayItems.push(result);
        this.formArray.push(this.formBuilder.control(result.title));
        console.log(this.formArray);
      }
    });
  }

  discardChanges(): void {
    this.dialogRef.close();
  }

  createNewCollection() {
    // TODO: Send Form to server
    this.dialogRef.close(this.arrayItems);
  }
}

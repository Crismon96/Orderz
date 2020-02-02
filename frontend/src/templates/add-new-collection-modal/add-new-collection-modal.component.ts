import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dataset } from '../../shared/Icollection';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AddNewDatasetModalComponent } from '../add-new-dataset-modal/add-new-dataset-modal.component';
import { MatSnackBar } from '@angular/material';
import { AddNewSelectionOptionModalComponent } from '../add-new-selection-option-modal/add-new-selection-option-modal.component';

@Component({
  selector: 'app-add-new-collection-modal',
  templateUrl: './add-new-collection-modal.component.html',
  styleUrls: ['./add-new-collection-modal.component.scss'],
})
export class AddNewCollectionModalComponent implements OnInit {
  form: FormGroup;
  arrayItems: Dataset[];

  get datasets() {
    return this.form.get('datasets') as FormArray;
  }

  constructor(
    public dialogRef: MatDialogRef<AddNewCollectionModalComponent>,
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.form = this.formBuilder.group({
      collectionTitle: this.formBuilder.control([]),
      collectionDescription: this.formBuilder.control([]),
      datasets: this.formBuilder.array([]),
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
        this.datasets.push(this.formBuilder.control(result));
      }
    });
  }

  discardChanges(): void {
    this.snackBar.open('Changes have been discharged', 'Close', {
      duration: 2500,
      panelClass: ['black'],
    });
  }

  createNewCollection() {
    // TODO: Send Form to server
    this.dialogRef.close(this.form.value);
  }
}

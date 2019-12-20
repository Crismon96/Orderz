import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ICollection } from '../../shared/Icollection';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddNewDatasetModalComponent } from '../add-new-dataset-modal/add-new-dataset-modal.component';

@Component({
  selector: 'app-add-new-collection-modal',
  templateUrl: './add-new-collection-modal.component.html',
  styleUrls: ['./add-new-collection-modal.component.scss'],
})
export class AddNewCollectionModalComponent implements OnInit {
  form: FormGroup;
  arrayItems: {
    title: string
    numberOfDataControls: number
  }[];

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
      width: '300px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The inner dialog was closed');
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createNewCollection() {
    console.log('form submitet');
  }
}

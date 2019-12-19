import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ICollection } from '../../shared/Icollection';
import { FormBuilder, FormGroup } from '@angular/forms';

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

  constructor(public dialogRef: MatDialogRef<AddNewCollectionModalComponent>, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      formArray: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    this.arrayItems = [];
  }

  addDataControl() {
    // TODO: Push real Data Control
    this.arrayItems.push();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  createNewCollection() {
    console.log('form submitet');
  }
}

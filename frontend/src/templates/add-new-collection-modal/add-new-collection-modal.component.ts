import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Dataset } from '../../shared/Icollection';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AddNewDatasetModalComponent } from '../add-new-dataset-modal/add-new-dataset-modal.component';
import { ToastController } from '@ionic/angular';

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
    public toastController: ToastController
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

  async discardChanges(): Promise<void> {
    const toast = await this.toastController.create({
      message: 'Changes have been discharged',
      duration: 2000,
    });
    await toast.present();
    this.dialogRef.close();
  }

  createNewCollection() {
    this.dialogRef.close(this.form.value);
  }
}

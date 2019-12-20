import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { Dataset } from '../../shared/Icollection';

@Component({
  selector: 'app-add-new-dataset-modal',
  templateUrl: './add-new-dataset-modal.component.html',
  styleUrls: ['./add-new-dataset-modal.component.scss'],
})
export class AddNewDatasetModalComponent implements OnInit, OnDestroy {
  title: string;
  dataType: string;
  subscription: Subscription;
  types = [
    { text: 'numbered Input (e.g. sizes, currency a.o.)', value: 'number' },
    { text: 'decisive Input (e.g. yes or no / true or false)', value: 'boolean' },
    { text: 'selection Input (e.g. choose from a predefined selection)', value: 'selection' },
  ];
  //  @ViewChild('datasetTitle', {static: true}) title: ElementRef;
  @ViewChild('datasetType', { static: true }) dataTypeInput: ElementRef;
  constructor(private lib: LibraryService, public dialogRef: MatDialogRef<AddNewDatasetModalComponent>) {}

  ngOnInit() {
    // @ts-ignore
    this.subscription = this.dataTypeInput.valueChange.subscribe(val => {
      this.dataType = val;
    });
  }

  addDatasetToCollection() {
    const newDataset: Dataset = {
      title: this.title,
      dataType: this.dataType,
    };
    this.dialogRef.close(newDataset);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

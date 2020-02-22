import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';
import { Dataset } from '../../shared/Icollection';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-new-dataset-modal',
  templateUrl: './add-new-dataset-modal.component.html',
  styleUrls: ['./add-new-dataset-modal.component.scss'],
})
export class AddNewDatasetModalComponent implements OnInit, OnDestroy {
  title: string;
  dataType: string;
  singleOption: string;
  selectionOptions = [];
  subscription: Subscription;
  form: FormGroup;
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
    this.subscription = this.dataTypeInput.ionChange.subscribe(val => {
      this.dataType = val.detail.value;
    });
  }

  addOptionToSelection() {
    this.selectionOptions.push(this.singleOption);
    this.singleOption = '';
  }

  addDatasetToCollection() {
    let newDataset: Dataset;
    if (this.selectionOptions.length > 0) {
      newDataset = {
        title: this.title,
        dataType: this.dataType,
        options: this.selectionOptions,
      };
    } else {
      newDataset = {
        title: this.title,
        dataType: this.dataType,
      };
    }
    this.dialogRef.close(newDataset);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

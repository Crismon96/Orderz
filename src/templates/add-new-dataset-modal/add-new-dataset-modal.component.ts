import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LibraryService } from '../../services/library.service';
import { MatDialogRef } from '@angular/material';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-new-dataset-modal',
  templateUrl: './add-new-dataset-modal.component.html',
  styleUrls: ['./add-new-dataset-modal.component.scss'],
})
export class AddNewDatasetModalComponent implements OnInit {
  title: string;
  dataa: any;
  types = [
    'numbered Input (e.g. sizes, currency a.o.)',
    'decisive Input (e.g. yes or no / true or false)',
    'selection Input (e.g. choose from a predefined selection)',
  ];
  //  @ViewChild('datasetTitle', {static: true}) title: ElementRef;
  @ViewChild('datasetType', { static: true }) dataType: ElementRef;
  constructor(private lib: LibraryService, public dialogRef: MatDialogRef<AddNewDatasetModalComponent>) {}

  ngOnInit() {}

  datasetTypeChange(event: any) {
    console.log(event);
  }

  addDatasetToCollection() {
    console.log('send the Data to donw compoenent');
    console.log('title: ', this.title);
    console.log('dataType: ', this.dataType);
    console.log('DATTAA: ', this.dataa);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

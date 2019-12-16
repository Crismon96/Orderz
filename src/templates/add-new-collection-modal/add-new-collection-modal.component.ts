import { Component, OnInit } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-collection-modal',
  templateUrl: './add-new-collection-modal.component.html',
  styleUrls: ['./add-new-collection-modal.component.scss']
})
export class AddNewCollectionModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddNewCollectionModalComponent>,
              ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}

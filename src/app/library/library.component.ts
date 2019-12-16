import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {AddNewCollectionModalComponent} from '../../templates/add-new-collection-modal/add-new-collection-modal.component';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  collections = ['one', 'two', 'three', '21312', 'one', 'two', 'three', '21312', 'one', 'two', 'three', '21312', 'one', 'two', 'three', '21312', 'one', 'two', 'three', '21312', 'one', 'two', 'three', '21312', 'one', 'two', 'three', '21312'];
  constructor(private router: Router,
              public dialog: MatDialog
              ) { }

  ngOnInit() {
  }

  navigateToVizBoard(choosenCollection) {
    this.router.navigateByUrl(`collection?${choosenCollection}`);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewCollectionModalComponent, {
      width: '500px'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

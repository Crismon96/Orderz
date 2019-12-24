import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewCollectionModalComponent } from '../../templates/add-new-collection-modal/add-new-collection-modal.component';
import { HeaderService } from '../../services/header.service';
import { LibraryService } from '../../services/library.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})
export class LibraryComponent implements OnInit {
  collections = ['one', 'two', 'three'];

  constructor(private router: Router, public dialog: MatDialog, private header: HeaderService, private lib: LibraryService) {}

  ngOnInit() {
    this.header.setTitle('Library');
  }

  openCollection(choosenCollection) {
    //  this.router.navigateByUrl(`collection?${choosenCollection}`);
    this.lib.getAllCollections().subscribe(data => {
      console.log(data);
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddNewCollectionModalComponent, {
      width: '500px',
      height: '500px',
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatExpansionModule,
  MatDialogModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatOptionModule,
  MatSelectModule,
} from '@angular/material';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibraryComponent } from './library/library.component';
import { CollectionViewComponent } from './library/collections/collection-view/collection-view.component';
import { AddNewCollectionModalComponent } from '../templates/add-new-collection-modal/add-new-collection-modal.component';
import { VizardComponent } from './vizard/vizard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserOptionsComponent } from './user-options/user-options.component';
import { AddNewDatasetModalComponent } from '../templates/add-new-dataset-modal/add-new-dataset-modal.component';
import { CollectionPanelComponent } from './library/collection-panel/collection-panel.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MainmenuComponent,
    HeaderComponent,
    SidebarComponent,
    LibraryComponent,
    CollectionViewComponent,
    AddNewCollectionModalComponent,
    VizardComponent,
    UserProfileComponent,
    UserOptionsComponent,
    AddNewDatasetModalComponent,
    CollectionPanelComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatExpansionModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [AddNewCollectionModalComponent, AddNewDatasetModalComponent],
})
export class AppModule {}

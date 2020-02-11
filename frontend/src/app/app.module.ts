import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
/*import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatOptionModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatDividerModule} from '@angular/material/divider';*/

import {
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatToolbarModule,
  MatIconModule,
  MatMenuModule,
  MatOptionModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSlideToggleModule,
  MatDividerModule,
} from '@angular/material';

import { TextFieldModule } from '@angular/cdk/text-field';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LibraryComponent } from './library/library.component';
import { CollectionViewComponent } from './library/collections/collection-views/collection-view/collection-view.component';
import { AddNewCollectionModalComponent } from '../templates/add-new-collection-modal/add-new-collection-modal.component';
import { VizardComponent } from './vizard/vizard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserOptionsComponent } from './user-options/user-options.component';
import { AddNewDatasetModalComponent } from '../templates/add-new-dataset-modal/add-new-dataset-modal.component';
import { CollectionPanelComponent } from './library/collections/collection-panel/collection-panel.component';
import { CollectionDataviewComponent } from './library/collections/collection-views/collection-dataview/collection-dataview.component';
import { CollectionDatatableComponent } from './library/collections/collection-views/collection-datatable/collection-datatable.component';
import { GoogleChartModule } from './google-chart/google-chart.module';
import { JwtInterceptorService } from '../services/jwt-interceptor.service';

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
    CollectionDataviewComponent,
    CollectionDatatableComponent,
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
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    TextFieldModule,
    MatSlideToggleModule,
    GoogleChartModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [AddNewCollectionModalComponent, AddNewDatasetModalComponent],
})
export class AppModule {}

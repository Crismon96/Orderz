import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainmenuComponent } from './mainmenu/mainmenu.component';
import { LibraryComponent } from './library/library.component';
import { CollectionViewComponent } from './library/collections/collection-views/collection-view/collection-view.component';
import { VizardComponent } from './vizard/vizard.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserOptionsComponent } from './user-options/user-options.component';
import { OfflineLibraryComponent } from './library/offline-library/offline-library.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'main', component: MainmenuComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'library', component: LibraryComponent },
  { path: 'libraryOff', component: OfflineLibraryComponent },
  { path: 'library/collection', component: CollectionViewComponent },
  { path: 'vizard', component: VizardComponent },
  { path: 'options', component: UserOptionsComponent },
  { path: 'profile', component: UserProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

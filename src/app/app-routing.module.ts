import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import {MainmenuComponent} from './mainmenu/mainmenu.component';
import {LibraryComponent} from './library/library.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'main', component: MainmenuComponent},
  {path: 'library', component: LibraryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

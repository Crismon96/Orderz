import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { HeaderService } from '../../services/header.service';
import { debounceTime, skip, take } from 'rxjs/operators';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  title = 'Data Diary';
  subscription: Subscription;
  constructor(private router: Router, private auth: AuthService, private header: HeaderService) {}

  ngOnInit(): void {
    this.subscription = this.header.activeTitle.pipe(debounceTime(100)).subscribe(title => {
      this.title = title;
    });
  }

  navigateBackButton() {
    this.header.activeUrl.pipe(skip(0), take(1)).subscribe(lastPage => {
      this.router.navigateByUrl(lastPage);
    });
  }

  logout() {
    this.router.navigateByUrl('').then(() => {
      console.log('Logging user out!');
      this.auth.isLoggedIn.next(false);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

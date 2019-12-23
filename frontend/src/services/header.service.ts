import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HeaderService {
  activeTitle = new BehaviorSubject('Data Diary');
  activeUrl = new ReplaySubject<string>(2);

  constructor(private router: Router) {
    this.router.events.pipe(debounceTime(200)).subscribe(route => {
      // @ts-ignore
      const url: string = route.routerEvent.url;
      this.activeUrl.next(url);
    });
  }

  setTitle(title: string) {
    this.activeTitle.next(title);
  }
}

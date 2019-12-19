import { Component, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('navState', [
      state(
        'deactive',
        style({
          'background-color': '#3F51B5',
        })
      ),
      state(
        'active',
        style({
          'background-color': '#ffa801',
        })
      ),
      transition('deactive => active', animate(150)),
      transition('active => deactive', animate(200)),
    ]),
    trigger('navState-sub1', [
      state(
        'deactive',
        style({
          transform: 'translateX(0) translateY(0)',
          opacity: '0',
        })
      ),
      state(
        'active',
        style({
          transform: 'translateX(5px) translateY(-75px)',
          opacity: '1',
        })
      ),
      transition('deactive => active', animate('200ms 50ms')),
      transition('active => deactive', animate(200)),
    ]),
    trigger('navState-sub2', [
      state(
        'deactive',
        style({
          transform: 'translateX(0) translateY(0)',
          opacity: '0',
        })
      ),
      state(
        'active',
        style({
          transform: 'translateX(55px) translateY(-55px)',
          opacity: '1',
        })
      ),
      transition('deactive => active', animate('200ms 100ms')),
      transition('active => deactive', animate(200)),
    ]),
    trigger('navState-sub3', [
      state(
        'deactive',
        style({
          transform: 'translateX(0) translateY(0)',
          opacity: '0',
        })
      ),
      state(
        'active',
        style({
          transform: 'translateX(75px) translateY(-5px)',
          opacity: '1',
        })
      ),
      transition('deactive => active', animate('200ms 150ms')),
      transition('active => deactive', animate(200)),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  navState = 'deactive';
  isLoggedIn: Observable<boolean>;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.isLoggedIn = this.auth.isLoggedIn;
  }

  onMobileNavActivation() {
    this.navState === 'deactive' ? (this.navState = 'active') : (this.navState = 'deactive');
  }

  onNavDataLib() {
    this.router.navigateByUrl('/library');
  }
  onNavDataViz() {
    this.router.navigateByUrl('/vizard');
  }
  onNavUserOpt() {
    this.router.navigateByUrl('/options');
  }
}

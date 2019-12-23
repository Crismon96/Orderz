import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'Orderz';
  isLoggedIn: BehaviorSubject<boolean>;
  constructor(private auth: AuthService) {}
  ngOnInit(): void {
    this.isLoggedIn = this.auth.isLoggedIn;
  }
}

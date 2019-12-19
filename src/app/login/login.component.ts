import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  constructor(private router: Router,
              private auth: AuthService) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  forgotPassword() {
    console.log('Open forgot Password');
  }

  login() {
    console.log('SUBMITTET')
    this.router.navigateByUrl('/main').then(() => {
      this.auth.isLoggedIn.next(true);
    });
  }
}

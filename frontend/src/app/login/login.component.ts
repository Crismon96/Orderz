import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  registerForm: FormGroup;
  isLoginScreen = true;
  busy = false;
  constructor(private router: Router, private auth: AuthService, public toastController: ToastController) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
    });
    this.registerForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl(),
      email: new FormControl(),
    });
  }

  forgotPassword() {
    console.log('Open forgot Password');
  }

  login() {
    const user = {
      username: this.loginForm.controls.username.value,
      password: this.loginForm.controls.password.value,
    };
    this.busy = true;
    this.auth.logUserIn(user).subscribe(() => {
      this.router.navigateByUrl('/main').then(() => {
        this.busy = false;
      });
    });
  }

  register() {
    const user = {
      username: this.registerForm.controls.username.value,
      password: this.registerForm.controls.password.value,
      email: this.registerForm.controls.email.value,
    };

    this.auth.registerNewUser(user).subscribe(async res => {
      const toast = await this.toastController.create({
        message: 'Your account was created. Please log in to enter.',
        duration: 2000,
      });
      await toast.present();
      this.isLoginScreen = true;
    });
  }
}

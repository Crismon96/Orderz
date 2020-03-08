import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { LoginResponse } from '../sharedModules/schemaInterfaces/POST-login-res.schema';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  hasToken = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router, public toastController: ToastController) {
    const token = localStorage.getItem('diarytoken');
    if (token && token !== '') {
      this.hasToken.next(token);
      this.isLoggedIn.next(true);
      this.router.navigateByUrl('/main');
    }
  }

  logUserIn(user) {
    return this.http.post<any>('api/auth/login', user).pipe(
      tap((res: LoginResponse) => {
        this.hasToken.next(res.token);
        this.isLoggedIn.next(!!res);
      }),
      map((token: LoginResponse) => {
        localStorage.setItem('diarytoken', token.token);
        return !!token;
      })
    );
  }

  logUserOut() {
    localStorage.removeItem('diarytoken');
    this.isLoggedIn.next(false);
    this.hasToken.next(null);
    this.router
      .navigateByUrl('')
      .then(() => {
        console.log('Logging out...');
      })
      .catch(() => {
        console.error('Problem logging user out');
      });
  }

  async throw401Error() {
    this.logUserOut();
    const toast = await this.toastController.create({
      message: 'Your session has expired or could not be validated. Please log in again.',
      duration: 2000,
    });
    await toast.present();
  }

  registerNewUser(user) {
    return this.http.put('api/auth/user', user, { responseType: 'text' });
  }
}

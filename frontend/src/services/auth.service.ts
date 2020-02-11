import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { map, tap } from 'rxjs/operators';
import { IToken } from '../../../backend/src/auth/encryption.service';
import { LoginResponse } from '../sharedModules/schemaInterfaces/POST-login-res.schema';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = new BehaviorSubject<boolean>(false);
  hasToken = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar) {
    const token = localStorage.getItem('diaryUserToken');
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
        localStorage.setItem('diaryUserToken', token.token);
        return !!token;
      })
    );
  }

  logUserOut() {
    this.router
      .navigateByUrl('')
      .then(() => {
        localStorage.removeItem('diaryUserToken');
        this.isLoggedIn.next(false);
        this.hasToken.next(null);
      })
      .catch(() => {
        console.error('Problem logging user out');
      });
  }

  throw401Error() {
    this.logUserOut();
    this.snackBar.open('Your session has expired or could not be validated. Please log in again.', 'close');
  }

  registerNewUser(user) {
    return this.http.put('api/auth/user', user, { responseType: 'text' });
  }
}

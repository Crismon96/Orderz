import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}
  // TODO: Change default to false
  isLoggedIn = new BehaviorSubject(true);

  logUserIn(username: string, password: string) {
    const newUser = {
      username,
      password,
      email: 'emailaddresse',
    };
    return this.http.put('api/auth/user', newUser, { responseType: 'text' });
  }
}

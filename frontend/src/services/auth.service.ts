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

  logUserIn(user) {
    return this.http.post('api/auth/login', user);
  }

  registerNewUser(user) {
    return this.http.put('api/auth/user', user, { responseType: 'text' });
  }
}

import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor() {}
    // TODO: Change default to false
    isLoggedIn = new BehaviorSubject(true)
}

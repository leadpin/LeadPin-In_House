import { Injectable } from '@angular/core';
import { loginData } from '../../constants/login-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn = false;
  constructor() {}
  login(userName: string, password: string): boolean {
    if (userName === loginData.userName && password === loginData.password) {
      this.isLoggedIn = true;
      return true;
    } else {
      this.isLoggedIn = false;
      return false;
    }
  }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  EmailValidator,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { loginData } from '../../../constants/login-data';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  passInputType = 'password';
  isInValid = false;
  loginForm = new FormGroup({
    userName: new FormControl('leadpin@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('Leadpin@2025', [Validators.required]),
  });
  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const userName = this.loginForm.get('userName')?.value;
    const password = this.loginForm.get('password')?.value;

    if (!userName || !password) {
      return;
    }

    const isValid = this.authService.login(userName, password);
    if (isValid) {
      this.router.navigate(['/dashboard']);
    } else {
      this.isInValid = true;
    }
  }

  tyepeChange() {
    if (this.passInputType == 'password') {
      this.passInputType = 'text';
    } else {
      this.passInputType = 'password';
    }
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class Login {

  loginForm!: FormGroup;

  loading = false;

  constructor(

private fb: FormBuilder,

private http: HttpClient,

private router: Router,

private auth: Auth

) {

    this.loginForm = this.fb.group({

      username: ['', Validators.required],

      password: ['', Validators.required]

    });

  }

  login() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }

    this.loading = true;

    this.http.post<any>(

      'https://kruti-electronics-backend.onrender.com/api/auth/login',

      this.loginForm.value

    ).subscribe({

      next: (res) => {

        this.loading = false;

        this.auth.saveToken(res.token);

        localStorage.setItem('admin', JSON.stringify(res.admin));

        alert("Login Successful");

        this.router.navigate(['/dashboard']);

      },

      error: (err) => {

        this.loading = false;

        alert(err.error.message);

      }

    });

  }

}

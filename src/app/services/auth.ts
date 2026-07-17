import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class Auth {

  constructor() { }

  // ===============================
  // Save Token
  // ===============================

  saveToken(token: string): void {

    localStorage.setItem('token', token);

  }

  // ===============================
  // Get Token
  // ===============================

  getToken(): string | null {

    return localStorage.getItem('token');

  }

  // ===============================
  // Login Status
  // ===============================

  isLoggedIn(): boolean {

    return !!localStorage.getItem('token');

  }

  // ===============================
  // Logout
  // ===============================

  logout(): void {

    localStorage.removeItem('token');

    localStorage.removeItem('admin');

  }

}

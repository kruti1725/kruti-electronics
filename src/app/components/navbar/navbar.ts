import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss']
})
export class Navbar {

  constructor(

    private router: Router,

    private auth: Auth

  ) {}

  // ===============================
  // Logout
  // ===============================

  logout(): void {

    const confirmLogout = confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) {
      return;
    }

    // Clear Token
    this.auth.logout();

    // Redirect Login
    this.router.navigate([
      '/kruti-admin-login-92731'
    ]);

  }

  // ===============================
  // Login Status
  // ===============================

  isLoggedIn(): boolean {

    return this.auth.isLoggedIn();

  }

}

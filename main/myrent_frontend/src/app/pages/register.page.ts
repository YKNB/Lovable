import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { Role } from '../core/models';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="grid two">
      <div class="card">
        <h1>Inscription</h1>
        <p>Creer un compte pour utiliser les routes protegees.</p>
        <form (ngSubmit)="submit()">
          <label>
            Prenom
            <input type="text" [(ngModel)]="firstName" name="firstName" required />
          </label>
          <label>
            Nom
            <input type="text" [(ngModel)]="lastName" name="lastName" required />
          </label>
          <label>
            Email
            <input type="email" [(ngModel)]="email" name="email" required />
          </label>
          <label>
            Mot de passe
            <input type="password" [(ngModel)]="password" name="password" required />
          </label>
          <label>
            Role
            <select [(ngModel)]="role" name="role" required>
              <option value="TENANT">TENANT</option>
              <option value="OWNER">OWNER</option>
            </select>
          </label>
          <button class="primary" type="submit">Creer le compte</button>
        </form>
        <div class="notification" *ngIf="success">
          Compte cree. Redirection vers la connexion...
        </div>
        <div class="notice danger" *ngIf="error">{{ error }}</div>
      </div>
      <div class="card">
        <h2>Deja un compte ?</h2>
        <p>Connecte-toi pour acceder aux routes protegees.</p>
        <a class="ghost" routerLink="/login">Aller a la connexion</a>
      </div>
    </section>
  `
})
export class RegisterPage {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  role: Role = 'TENANT';
  error = '';
  success = false;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  submit() {
    this.error = '';
    this.success = false;
    this.auth
      .register({
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        password: this.password,
        role: this.role
      })
      .subscribe({
        next: () => {
          this.success = true;
          setTimeout(() => this.router.navigate(['/login']), 1200);
        },
        error: (err) => {
          this.error = err?.error?.error || 'Echec inscription.';
        }
      });
  }
}

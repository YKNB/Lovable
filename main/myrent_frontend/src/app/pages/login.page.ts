import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="grid two">
      <div class="card">
        <h1>Connexion</h1>
        <p>Connecte-toi pour acceder aux reservations et a la gestion.</p>
        <form (ngSubmit)="submit()">
          <label>
            Email
            <input type="email" [(ngModel)]="email" name="email" required />
          </label>
          <label>
            Mot de passe
            <input type="password" [(ngModel)]="password" name="password" required />
          </label>
          <button class="primary" type="submit">Se connecter</button>
        </form>
        <div class="notice danger" *ngIf="error">{{ error }}</div>
      </div>
      <div class="card">
        <h2>Nouveau ici ?</h2>
        <p>Cree un compte tenant ou owner pour utiliser les routes.</p>
        <a class="ghost" routerLink="/register">Aller a l'inscription</a>
      </div>
    </section>
  `
})
export class LoginPage {
  email = '';
  password = '';
  error = '';

  constructor(private readonly auth: AuthService, private readonly router: Router) {}

  submit() {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => {
        this.error = err?.error?.error || 'Echec de connexion.';
      }
    });
  }
}

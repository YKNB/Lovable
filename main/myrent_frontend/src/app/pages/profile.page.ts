import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../core/auth.service';
import { MeService } from '../services/me.service';
import { UsersService } from '../services/users.service';
import { User } from '../core/models';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="grid two">
      <div class="card">
        <h1>Mon profil</h1>
        <div class="stack" *ngIf="meUser; else loading">
          <div class="row">
            <span class="pill">ID: {{ meUser.id }}</span>
            <span class="pill">Role: {{ meUser.role }}</span>
          </div>
          <p>{{ meUser.first_name }} {{ meUser.last_name }}</p>
          <p>{{ meUser.email }}</p>
        </div>
        <ng-template #loading>
          <p>Chargement du profil...</p>
        </ng-template>
        <div class="notice warn" *ngIf="loadError">{{ loadError }}</div>
      </div>

      <div class="card">
        <h2>Mettre a jour</h2>
        <form (ngSubmit)="update()">
          <label>
            Prenom
            <input type="text" [(ngModel)]="firstName" name="firstName" />
          </label>
          <label>
            Nom
            <input type="text" [(ngModel)]="lastName" name="lastName" />
          </label>
          <label>
            Nouveau mot de passe
            <input type="password" [(ngModel)]="password" name="password" />
          </label>
          <button class="primary" type="submit">Mettre a jour</button>
        </form>
        <div class="notice ok" *ngIf="updateSuccess">Profil mis a jour.</div>
        <div class="notice danger" *ngIf="updateError">{{ updateError }}</div>
      </div>

      <div class="card">
        <h2>Supprimer le compte</h2>
        <p>Cette action supprime le compte et deconnecte.</p>
        <button class="ghost" type="button" (click)="remove()">Supprimer</button>
        <div class="notice ok" *ngIf="deleteSuccess">Compte supprime.</div>
        <div class="notice danger" *ngIf="deleteError">{{ deleteError }}</div>
      </div>
    </section>
  `
})
export class ProfilePage implements OnInit {
  meUser?: User;
  firstName = '';
  lastName = '';
  password = '';
  loadError = '';
  updateError = '';
  updateSuccess = false;
  deleteError = '';
  deleteSuccess = false;

  constructor(
    private readonly auth: AuthService,
    private readonly meService: MeService,
    private readonly usersService: UsersService
  ) {}

  ngOnInit() {
    this.meService.getMe().subscribe({
      next: (data) => {
        this.meUser = data.user;
        this.firstName = data.user.first_name;
        this.lastName = data.user.last_name;
      },
      error: (err) => {
        this.loadError = err?.error?.error || 'Impossible de charger le profil.';
      }
    });
  }

  update() {
    if (!this.meUser) {
      return;
    }
    this.updateError = '';
    this.updateSuccess = false;
    const payload: { first_name?: string; last_name?: string; password?: string } = {};
    if (this.firstName.trim()) {
      payload.first_name = this.firstName.trim();
    }
    if (this.lastName.trim()) {
      payload.last_name = this.lastName.trim();
    }
    if (this.password.trim()) {
      payload.password = this.password;
    }
    if (Object.keys(payload).length === 0) {
      this.updateError = 'Aucun champ a mettre a jour.';
      return;
    }

    this.usersService.update(this.meUser.id, payload).subscribe({
      next: (user) => {
        this.updateSuccess = true;
        this.meUser = user;
        this.auth.setUser(user);
      },
      error: (err) => {
        this.updateError = err?.error?.error || 'Mise a jour echouee.';
      }
    });
  }

  remove() {
    if (!this.meUser) {
      return;
    }
    this.deleteError = '';
    this.deleteSuccess = false;
    this.usersService.remove(this.meUser.id).subscribe({
      next: () => {
        this.deleteSuccess = true;
        this.auth.logout();
      },
      error: (err) => {
        this.deleteError = err?.error?.error || 'Suppression echouee.';
      }
    });
  }
}

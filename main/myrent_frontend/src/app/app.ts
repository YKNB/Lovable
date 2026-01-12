import { Component, signal } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { LoadingService } from './core/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  menuOpen = signal(false);

  constructor(
    readonly auth: AuthService,
    readonly loading: LoadingService
  ) {}

  logout() {
    this.auth.logout();
  }

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }

  closeMenu() {
    this.menuOpen.set(false);
  }
}

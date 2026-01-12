import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="card">
      <h1>Page introuvable</h1>
      <p>Cette route n'existe pas.</p>
      <a class="ghost" routerLink="/">Retour a l'accueil</a>
    </section>
  `
})
export class NotFoundPage {}

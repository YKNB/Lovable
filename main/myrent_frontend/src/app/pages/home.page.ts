import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PropertiesService } from '../services/properties.service';
import { Property } from '../core/models';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="grid">
      <div class="hero">
        <h1>ETNAir</h1>
        <p>Decouvre les biens disponibles et reserve en quelques clics.</p>
        <div class="meta">
          <span class="badge">Public</span>
          <span class="badge">{{ properties.length }} biens</span>
        </div>
        <div class="notice warn" *ngIf="error">{{ error }}</div>
      </div>

      <div class="grid two">
        <div class="card property-card" *ngFor="let property of properties">
          <div class="property-cover">
            <img *ngIf="property.image_url" [src]="property.image_url" alt="Image du bien" />
            <span *ngIf="!property.image_url">{{ property.city }}</span>
          </div>
          <div class="row">
            <h3>{{ property.title }}</h3>
            <span class="pill">{{ property.city }}</span>
          </div>
          <p>{{ property.description || 'Aucune description.' }}</p>
          <div class="meta">
            <span class="pill">{{ property.price_per_night }} / nuit</span>
            <span class="pill">Guests: {{ property.max_guests || 1 }}</span>
          </div>
          <div class="row">
            <a class="primary" [routerLink]="['/properties', property.id]">Voir le detail</a>
          </div>
        </div>
      </div>
    </section>
  `
})
export class HomePage implements OnInit {
  properties: Property[] = [];
  error = '';

  constructor(private readonly propertiesService: PropertiesService) {}

  ngOnInit() {
    this.load();
  }

  private load() {
    this.error = '';
    this.propertiesService.list().subscribe({
      next: (data) => (this.properties = data),
      error: (err) => {
        this.error = err?.error?.error || 'Impossible de charger les biens.';
      }
    });
  }
}

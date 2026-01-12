import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PropertiesService } from '../services/properties.service';
import { BookingsService } from '../services/bookings.service';
import { Property } from '../core/models';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-property-detail-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="grid two">
      <div class="card" *ngIf="property; else loading">
        <div class="property-cover">
          <img *ngIf="property.image_url" [src]="property.image_url" alt="Image du bien" />
          <span *ngIf="!property.image_url">{{ property.city }}</span>
        </div>
        <div class="row">
          <h1>{{ property.title }}</h1>
          <span class="pill">{{ property.city }}</span>
        </div>
        <p>{{ property.description || 'Aucune description.' }}</p>
        <div class="row">
          <span class="pill">Prix: {{ property.price_per_night }} / nuit</span>
          <span class="pill">ID: {{ property.id }}</span>
        </div>
        <div class="row">
          <span class="pill">Guests max: {{ property.max_guests || 1 }}</span>
          <span class="pill">Owner: {{ property.owner_id }}</span>
        </div>
        <div class="notice warn" *ngIf="error">{{ error }}</div>
      </div>

      <ng-template #loading>
        <div class="card">
          <p>Chargement du bien...</p>
        </div>
      </ng-template>

      <div class="card">
        <h2>Reserver (TENANT)</h2>
        <p>Route: POST /bookings</p>
        <form (ngSubmit)="submitBooking()">
          <label>
            Date de debut
            <input type="date" [(ngModel)]="startDate" name="startDate" required />
          </label>
          <label>
            Date de fin
            <input type="date" [(ngModel)]="endDate" name="endDate" required />
          </label>
          <button class="primary" type="submit" [disabled]="!isTenant()">Reserver</button>
        </form>
        <div class="notice warn" *ngIf="!isTenant()">Connexion TENANT requise.</div>
        <div class="notice ok" *ngIf="bookingSuccess">Reservation creee.</div>
        <div class="notice danger" *ngIf="bookingError">{{ bookingError }}</div>
      </div>
    </section>
  `
})
export class PropertyDetailPage implements OnInit {
  property?: Property;
  startDate = '';
  endDate = '';
  error = '';
  bookingError = '';
  bookingSuccess = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly propertiesService: PropertiesService,
    private readonly bookingsService: BookingsService,
    private readonly auth: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de bien manquant.';
      return;
    }
    this.propertiesService.getById(id).subscribe({
      next: (data) => (this.property = data),
      error: (err) => {
        this.error = err?.error?.error || 'Impossible de charger le bien.';
      }
    });
  }

  isTenant() {
    return this.auth.user()?.role === 'TENANT';
  }

  submitBooking() {
    this.bookingError = '';
    this.bookingSuccess = false;
    if (!this.property) {
      this.bookingError = 'Bien introuvable.';
      return;
    }
    this.bookingsService
      .create({
        property_id: this.property.id,
        start_date: this.startDate,
        end_date: this.endDate
      })
      .subscribe({
        next: () => (this.bookingSuccess = true),
        error: (err) => {
          this.bookingError = err?.error?.error || 'Impossible de creer la reservation.';
        }
      });
  }
}

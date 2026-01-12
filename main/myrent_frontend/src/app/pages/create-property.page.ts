import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../services/properties.service';
import { Property } from '../core/models';

@Component({
  selector: 'app-create-property-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="grid two">
      <div class="card">
        <h1>Creer un bien (OWNER)</h1>
        <form (ngSubmit)="submit()">
          <label>
            Titre
            <input type="text" [(ngModel)]="title" name="title" required />
          </label>
          <label>
            Ville
            <input type="text" [(ngModel)]="city" name="city" required />
          </label>
          <label>
            Prix par nuit
            <input type="number" [(ngModel)]="pricePerNight" name="pricePerNight" required />
          </label>
          <label>
            Description
            <textarea [(ngModel)]="description" name="description"></textarea>
          </label>
          <label>
            Adresse
            <input type="text" [(ngModel)]="address" name="address" />
          </label>
          <label>
            Guests max
            <input type="number" [(ngModel)]="maxGuests" name="maxGuests" />
          </label>
          <label>
            Image (optionnel)
            <input type="file" accept="image/*" (change)="onFileChange($event)" />
          </label>
          <button class="primary" type="submit">Creer</button>
        </form>
        <div class="notice ok" *ngIf="created">Bien cree. ID: {{ created.id }}</div>
        <div class="notice ok" *ngIf="uploadSuccess">Image envoyee.</div>
        <div class="notice danger" *ngIf="error">{{ error }}</div>
        <div class="notice danger" *ngIf="uploadError">{{ uploadError }}</div>
      </div>
      <div class="card">
        <h2>Astuce</h2>
        <p>Tu peux ensuite gerer le bien via la page "Gerer un bien".</p>
      </div>
    </section>
  `
})
export class CreatePropertyPage {
  title = '';
  city = '';
  pricePerNight = 0;
  description = '';
  address = '';
  maxGuests?: number;
  error = '';
  created?: Property;
  selectedFile?: File;
  uploadError = '';
  uploadSuccess = false;

  constructor(private readonly propertiesService: PropertiesService) {}

  submit() {
    this.error = '';
    this.created = undefined;
    this.uploadError = '';
    this.uploadSuccess = false;
    this.propertiesService
      .create({
        title: this.title,
        city: this.city,
        price_per_night: Number(this.pricePerNight),
        description: this.description || undefined,
        address: this.address || undefined,
        max_guests: this.maxGuests || undefined
      })
      .subscribe({
        next: (data) => {
          this.created = data;
          if (this.selectedFile) {
            this.propertiesService.uploadImage(data.id, this.selectedFile).subscribe({
              next: (updated) => {
                this.created = updated;
                this.uploadSuccess = true;
              },
              error: (err) => {
                this.uploadError = err?.error?.error || 'Upload image echoue.';
              }
            });
          }
        },
        error: (err) => {
          this.error = err?.error?.error || 'Impossible de creer le bien.';
        }
      });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files?.[0];
  }
}

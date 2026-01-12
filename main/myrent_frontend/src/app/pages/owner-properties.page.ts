import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PropertiesService } from '../services/properties.service';
import { Property, PropertyUpdateBody } from '../core/models';
import { AuthService } from '../core/auth.service';

@Component({
  selector: 'app-owner-properties-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="grid two">
      <div class="card">
        <h1>Gerer un bien (OWNER / ADMIN)</h1>
        <form (ngSubmit)="loadProperty()">
          <label>
            ID du bien
            <input type="text" [(ngModel)]="propertyId" name="propertyId" required />
          </label>
          <button class="ghost" type="submit">Charger le bien</button>
        </form>
        <div class="notice warn" *ngIf="loadError">{{ loadError }}</div>
        <div class="notice ok" *ngIf="property">Bien charge: {{ property.title }}</div>
        <div class="notice warn" *ngIf="property && !canEdit()">
          Acces refuse: seul le proprietaire ou un ADMIN peut modifier.
        </div>
      </div>

      <div class="card">
        <h2>Modifier</h2>
        <form (ngSubmit)="updateProperty()" *ngIf="property">
          <label>
            Titre
            <input type="text" [(ngModel)]="title" name="title" />
          </label>
          <label>
            Ville
            <input type="text" [(ngModel)]="city" name="city" />
          </label>
          <label>
            Prix par nuit
            <input type="number" [(ngModel)]="pricePerNight" name="pricePerNight" />
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
            Image URL
            <input type="text" [(ngModel)]="imageUrl" name="imageUrl" />
          </label>
          <button class="primary" type="submit" [disabled]="!canEdit()">Mettre a jour</button>
        </form>
        <div class="notice ok" *ngIf="updateSuccess">Bien mis a jour.</div>
        <div class="notice danger" *ngIf="updateError">{{ updateError }}</div>
      </div>

      <div class="card">
        <h2>Uploader une image</h2>
        <form (ngSubmit)="uploadImage()" *ngIf="property">
          <label>
            Fichier image
            <input type="file" accept="image/*" (change)="onFileChange($event)" />
          </label>
          <button class="ghost" type="submit" [disabled]="!canEdit()">Envoyer</button>
        </form>
        <div class="notice ok" *ngIf="uploadSuccess">Image envoyee.</div>
        <div class="notice danger" *ngIf="uploadError">{{ uploadError }}</div>
      </div>

      <div class="card">
        <h2>Supprimer</h2>
        <p>Supprimer le bien charge.</p>
        <button
          class="ghost"
          type="button"
          (click)="deleteProperty()"
          [disabled]="!property || !canEdit()"
        >
          Supprimer le bien
        </button>
        <div class="notice ok" *ngIf="deleteSuccess">Bien supprime.</div>
        <div class="notice danger" *ngIf="deleteError">{{ deleteError }}</div>
      </div>
    </section>
  `
})
export class OwnerPropertiesPage {
  propertyId = '';
  property?: Property;
  title = '';
  city = '';
  pricePerNight?: number | null;
  description = '';
  address = '';
  maxGuests?: number | null;
  imageUrl = '';
  selectedFile?: File;

  loadError = '';
  updateError = '';
  updateSuccess = false;
  uploadError = '';
  uploadSuccess = false;
  deleteError = '';
  deleteSuccess = false;

  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly auth: AuthService
  ) {}

  loadProperty() {
    this.resetStatus();
    this.propertiesService.getById(this.propertyId).subscribe({
      next: (data) => {
        this.property = data;
        this.title = data.title ?? '';
        this.city = data.city ?? '';
        this.pricePerNight = Number(data.price_per_night);
        this.description = data.description ?? '';
        this.address = data.address ?? '';
        this.maxGuests = data.max_guests ?? undefined;
        this.imageUrl = data.image_url ?? '';
      },
      error: (err) => {
        this.loadError = err?.error?.error || 'Impossible de charger le bien.';
      }
    });
  }

  updateProperty() {
    if (!this.property) {
      return;
    }
    this.updateError = '';
    this.updateSuccess = false;
    const payload = this.buildUpdatePayload();
    this.propertiesService.update(this.property.id, payload).subscribe({
      next: (data) => {
        this.property = data;
        this.updateSuccess = true;
      },
      error: (err) => {
        this.updateError = err?.error?.error || 'Impossible de mettre a jour.';
      }
    });
  }

  uploadImage() {
    if (!this.property || !this.selectedFile) {
      this.uploadError = 'Selectionne un fichier.';
      return;
    }
    this.uploadError = '';
    this.uploadSuccess = false;
    this.propertiesService.uploadImage(this.property.id, this.selectedFile).subscribe({
      next: () => (this.uploadSuccess = true),
      error: (err) => {
        this.uploadError = err?.error?.error || 'Upload echoue.';
      }
    });
  }

  deleteProperty() {
    if (!this.property) {
      return;
    }
    this.deleteError = '';
    this.deleteSuccess = false;
    this.propertiesService.remove(this.property.id).subscribe({
      next: () => {
        this.deleteSuccess = true;
        this.property = undefined;
      },
      error: (err) => {
        this.deleteError = err?.error?.error || 'Suppression echouee.';
      }
    });
  }

  onFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files?.[0];
  }

  canEdit() {
    const user = this.auth.user();
    if (!user || !this.property) {
      return false;
    }
    if (user.role === 'ADMIN') {
      return true;
    }
    return user.role === 'OWNER' && user.id === this.property.owner_id;
  }

  private buildUpdatePayload(): PropertyUpdateBody {
    const payload: PropertyUpdateBody = {};
    if (this.title.trim()) {
      payload.title = this.title.trim();
    }
    if (this.city.trim()) {
      payload.city = this.city.trim();
    }
    if (this.description.trim()) {
      payload.description = this.description.trim();
    }
    if (this.address.trim()) {
      payload.address = this.address.trim();
    }
    if (this.imageUrl.trim()) {
      payload.image_url = this.imageUrl.trim();
    }
    if (this.pricePerNight !== null && this.pricePerNight !== undefined) {
      payload.price_per_night = Number(this.pricePerNight);
    }
    if (this.maxGuests !== null && this.maxGuests !== undefined) {
      payload.max_guests = Number(this.maxGuests);
    }
    return payload;
  }

  private resetStatus() {
    this.loadError = '';
    this.updateError = '';
    this.updateSuccess = false;
    this.uploadError = '';
    this.uploadSuccess = false;
    this.deleteError = '';
    this.deleteSuccess = false;
  }
}

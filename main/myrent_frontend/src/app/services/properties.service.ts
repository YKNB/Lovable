import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';
import { Property, PropertyCreateBody, PropertyUpdateBody } from '../core/models';

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  constructor(private readonly http: HttpClient) {}

  list() {
    return this.http.get<Property[]>(`${API_BASE_URL}/properties`);
  }

  getById(id: string) {
    return this.http.get<Property>(`${API_BASE_URL}/properties/${id}`);
  }

  create(body: PropertyCreateBody) {
    return this.http.post<Property>(`${API_BASE_URL}/properties`, body);
  }

  update(id: string, body: PropertyUpdateBody) {
    return this.http.patch<Property>(`${API_BASE_URL}/properties/${id}`, body);
  }

  remove(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/properties/${id}`);
  }

  uploadImage(id: string, file: File) {
    const data = new FormData();
    data.append('image', file);
    return this.http.post<Property>(`${API_BASE_URL}/properties/${id}/image`, data);
  }
}

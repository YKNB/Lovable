import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';
import { User } from '../core/models';

@Injectable({ providedIn: 'root' })
export class MeService {
  constructor(private readonly http: HttpClient) {}

  getMe() {
    return this.http.get<{ user: User }>(`${API_BASE_URL}/me`);
  }
}

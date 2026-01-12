import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL } from '../core/api.config';
import { User } from '../core/models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  update(id: string, body: { first_name?: string; last_name?: string; password?: string }) {
    return this.http.put<User>(`${API_BASE_URL}/users/${id}`, body);
  }

  remove(id: string) {
    return this.http.delete<void>(`${API_BASE_URL}/users/${id}`);
  }
}

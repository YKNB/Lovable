import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { API_BASE_URL } from './api.config';
import { AuthResponse, Role, User } from './models';

const TOKEN_KEY = 'etnair_token';
const USER_KEY = 'etnair_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSignal = signal<User | null>(this.readUser());
  readonly user = this.userSignal.asReadonly();

  constructor(private readonly http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${API_BASE_URL}/auth/login`, { email, password })
      .pipe(tap((response) => this.setSession(response)));
  }

  register(body: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: Role;
  }) {
    return this.http.post<User>(`${API_BASE_URL}/auth/register`, body);
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
  }

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return Boolean(this.token);
  }

  private setSession(response: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, response.token);
    this.setUser(response.user);
  }

  private readUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  setUser(user: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }
}

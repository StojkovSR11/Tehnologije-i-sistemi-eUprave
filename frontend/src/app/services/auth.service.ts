import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

export interface User {
  jmbg: string;
  name: string;
  role: string;
  id?: string;
}

export interface LoginRequest {
  jmbg: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Novi tip za registraciju
export interface RegisterRequest {
  jmbg: string;
  email: string;
  ime: string;
  prezime: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = "http://localhost:8082";

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = localStorage.getItem("authToken");
    if (token) {
      const user = this.getUserFromToken(token);
      if (user) {
        this.currentUserSubject.next(user);
      } else {
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
      }
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem("authToken", response.token);
          const user = this.getUserFromToken(response.token);
          if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user));
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/register`, data);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem("authToken");

    return this.http
      .post(
        `${this.API_URL}/sso/logout`,
        {},
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )
      .pipe(
        tap(() => {
          localStorage.removeItem("authToken");
          localStorage.removeItem("currentUser");
          this.currentUserSubject.next(null);
        })
      );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem("authToken");
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  testService(): Observable<any> {
    return this.http.get(`${this.API_URL}/health`);
  }

  getCurrentUserId(): string {
    const user = this.getCurrentUser();
    return user?.id || '';
  }

  private getUserFromToken(token: string): User | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = parts[1];
      const decodedPayload = atob(payload);
      const tokenData = JSON.parse(decodedPayload);

      // Proveravamo da li je token istekao
      if (tokenData.exp && tokenData.exp * 1000 < Date.now()) {
        return null;
      }

      // Standardizacija role
      let role = (tokenData.role || tokenData.uloga || '').toUpperCase();

      // Ime korisnika
      const name =
        (tokenData.name && tokenData.name.trim()) ||
        `${tokenData.ime || 'Nepoznato'} ${tokenData.prezime || ''}`.trim();

      const user: User = {
        jmbg: tokenData.jmbg,
        name,
        role,
        id: tokenData.id || tokenData._id || undefined
      };

      console.log('Decoded user from token:', user);
      return user;

    } catch (error) {
      console.error("Error decoding JWT token:", error);
      return null;
    }
  }
}
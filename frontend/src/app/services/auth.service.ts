import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { tap } from "rxjs/operators";

export interface User {
  jmbg: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  jmbg: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Novi tip za registraciju
export interface RegisterRequest {
  jmbg: string;
  email: string;
  name: string;
  password: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private http = inject(HttpClient);
  private readonly API_URL = "http://localhost:8082/api/v1";

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("currentUser");
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, credentials)
      .pipe(
        tap((response) => {
          localStorage.setItem("authToken", response.token);
          localStorage.setItem("currentUser", JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
        })
      );
  }

  // NOVO: REGISTER METOD
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
    return this.http.get(`http://localhost:8082/health`);
  }
}

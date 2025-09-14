import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Pregled {
  id?: string;
  jmbg: string;
  doktor: string;
  datum: string;
  vreme: string;
  tip: string;
  status?: string;
}

export interface Uput {
  id?: string;
  jmbg: string;
  lekar: string;
  specijalista: string;
  dijagnoza: string;
  datum: string;
}

export interface Notifikacija {
  id?: string;
  jmbg: string;
  poruka: string;
  datum: string;
  procitana?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class ZdravstvoService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_URL = "http://localhost:8080/api/v1";

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  // Pregledi
  zakaziPregled(pregled: Pregled): Observable<any> {
    return this.http.post(`${this.API_URL}/pregledi`, pregled, {
      headers: this.getHeaders(),
    });
  }

  checkinPregled(id: string): Observable<any> {
    return this.http.put(
      `${this.API_URL}/pregledi/${id}/checkin`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Uputi
  kreirajUput(uput: Uput): Observable<any> {
    return this.http.post(`${this.API_URL}/uputi`, uput, {
      headers: this.getHeaders(),
    });
  }

  // Validacija
  validacijaZdravstveneKnjizice(jmbg: string): Observable<any> {
    return this.http.get(`${this.API_URL}/validacija/${jmbg}`, {
      headers: this.getHeaders(),
    });
  }

  // Notifikacije
  getNotifikacije(jmbg: string): Observable<Notifikacija[]> {
    return this.http.get<Notifikacija[]>(
      `${this.API_URL}/notifikacije/${jmbg}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Test
  testService(): Observable<any> {
    return this.http.get(`http://localhost:8080/health`);
  }

  testAPI(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/pregledi`,
      { test: true },
      {
        headers: this.getHeaders(),
      }
    );
  }
}

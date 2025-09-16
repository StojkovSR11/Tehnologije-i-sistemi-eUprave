import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Dete {
  ime: string;
  prezime: string;
  jmbg: string;
  datumRodj: string;
  korisnikId: string;
}

export interface ZahtevZaUpis {
  id?: string;
  dete: Dete;
  vrticId: string;
  status?: string;
  datumZahteva?: string;
}

export interface Vrtic {
  id: string;
  naziv: string;
  //adresa: string;
  kapacitet: number;
  brojSlobodnihMesta: number;
}

export interface Potvrda {
  id?: string;
  zahtevId: string;
  datum: string;
  vrtic: string;
}

export interface Obavestenje {
  id?: string;
  jmbgRoditelja: string;
  poruka: string;
  datum: string;
  procitano?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class PredskolskeService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private readonly API_URL = "http://localhost:8081/api/v1";

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    });
  }

  // Zahtevi za upis
  podnesZahtev(zahtev: ZahtevZaUpis): Observable<any> {
    return this.http.post(`${this.API_URL}/zahtevi`, zahtev, {
      headers: this.getHeaders(),
    });
  }

  odobriZahtev(id: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/zahtevi/${id}/odobri`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Vrtići
  /*getVrtici(): Observable<Vrtic[]> {
    return this.http.get<Vrtic[]>(`${this.API_URL}/vrtici`, {
      headers: this.getHeaders(),
    });
  }*/

  // Potvrde
  getPotvrda(id: string): Observable<Potvrda> {
    return this.http.get<Potvrda>(`${this.API_URL}/potvrde/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // Obaveštenja
  getObavestenja(jmbgRoditelja: string): Observable<Obavestenje[]> {
    return this.http.get<Obavestenje[]>(
      `${this.API_URL}/obavestenja/${jmbgRoditelja}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Test
  testService(): Observable<any> {
    return this.http.get(`http://localhost:8081/health`);
  }

  testAPI(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/zahtevi`,
      { test: true },
      {
        headers: this.getHeaders(),
      }
    );
  }

  // Deca
getDeca(): Observable<Dete[]> {
  return this.http.get<Dete[]>(`${this.API_URL}/dete`, {
    headers: this.getHeaders(),
  });
}

dodajDete(dete: Dete): Observable<Dete> {
  return this.http.post<Dete>(`${this.API_URL}/dete`, dete, {
    headers: this.getHeaders(),
  });
}

getDeteById(id: string): Observable<Dete> {
  return this.http.get<Dete>(`${this.API_URL}/dete/${id}`, {
    headers: this.getHeaders(),
  });
}

//vrtici
getVrtici(): Observable<Vrtic[]> {
  return this.http.get<Vrtic[]>(`${this.API_URL}/vrtic`, {
    headers: this.getHeaders(),
  });
}

dodajVrtic(vrtic: Vrtic): Observable<Vrtic> {
  return this.http.post<Vrtic>(`${this.API_URL}/vrtic`, vrtic, {
    headers: this.getHeaders(),
  });
}


// Zahtevi
getZahtevi(): Observable<ZahtevZaUpis[]> {
  return this.http.get<ZahtevZaUpis[]>(`${this.API_URL}/zahtev`, {
    headers: this.getHeaders(),
  });
}

getZahtevById(id: string): Observable<ZahtevZaUpis> {
  return this.http.get<ZahtevZaUpis>(`${this.API_URL}/zahtev/${id}`, {
    headers: this.getHeaders(),
  });
}

dodajZahtev(zahtev: ZahtevZaUpis): Observable<ZahtevZaUpis> {
  return this.http.post<ZahtevZaUpis>(`${this.API_URL}/zahtev`, zahtev, {
    headers: this.getHeaders(),
  });
}


azurirajZahtev(id: string, zahtev: ZahtevZaUpis): Observable<ZahtevZaUpis> {
  return this.http.put<ZahtevZaUpis>(`${this.API_URL}/zahtev/${id}`, zahtev, {
    headers: this.getHeaders(),
  });
}

obrisiZahtev(id: string): Observable<any> {
  return this.http.delete(`${this.API_URL}/zahtev/${id}`, {
    headers: this.getHeaders(),
  });
}

}

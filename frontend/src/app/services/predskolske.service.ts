import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

export interface Dete {
   id?: string;
  ime: string;
  prezime: string;
  jmbg: string;
  datumRodj: string;
  korisnikId: string;
  vrticID?: string;
  grupaID?: string;
}

export interface ZahtevZaUpis {
  id?: string;
  deteId: string; 
  //dete: Dete;
  vrticId: string;
  status?: string;
  datumPodnosenja?: string;
  napomena?: string;
}

export interface Vrtic {
  id: string;
  naziv: string;
  //adresa: string;
  kapacitet: number;
  brojSlobodnihMesta: number;

  brojUpisanihDece?: number;
}

export interface Potvrda {
  id?: string;
  zahtevId: string;
  datum: string;
  vrtic: string;
}

export interface Obavestenje {
  id?: string;
  korisnikId: string;
  deteId: string;
  grupaId: string;
  poruka: string;
  createdAt: string;
}


export interface Grupa {
  id?: string;
  naziv: string;
  vrticID: string;
  kapacitet: number;
  listaDece?: string[];
}

export interface PrisustvoDogadjaj {
  id?: string;
  deteId: string;
  vrticId: string;
  tipDogadjaja: "DOLAZAK" | "PREUZIMANJE";
  vreme: string;
  napomena?: string;
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
    return this.http.post(`${this.API_URL}/zahtev`, zahtev, {
      headers: this.getHeaders(),
    });
  }

  /*odobriZahtev(id: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/zahtevi/${id}/odobri`,
      {},
      {
        headers: this.getHeaders(),
      }
    );
  }*/

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
  getMojaObavestenja(): Observable<Obavestenje[]> {
    return this.http.get<Obavestenje[]>(`${this.API_URL}/obavestenja/moja`, {
      headers: this.getHeaders(),
    });
  }

  // Test
  testService(): Observable<any> {
    return this.http.get(`http://localhost:8081/health`);
  }

  testAPI(): Observable<any> {
    return this.http.post(
      `${this.API_URL}/zahtev`,
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

obrisiDete(id: string): Observable<void> {
  return this.http.delete<void>(`${this.API_URL}/dete/${id}`, {
    headers: this.getHeaders(),
  });
}


// Vrati decu za trenutno ulogovanog korisnika
getMojaDeca(): Observable<Dete[]> {
  return this.http.get<Dete[]>(`${this.API_URL}/moja-deca`, {
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

obrisiVrtic(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/vrtic/${id}`, {
        headers: this.getHeaders()
    });
}

azurirajVrtic(id: string, vrtic: Vrtic): Observable<Vrtic> {
  return this.http.put<Vrtic>(`${this.API_URL}/vrtic/${id}`, vrtic, {
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


//prva funkcionalnost - upisivanje deteta u vrtic

odobriZahtev(id: string): Observable<any> {
  return this.http.put(
    `${this.API_URL}/zahtev/${id}/odobri`,
    {},
    {
      headers: this.getHeaders(),
    }
  );
}

odbijZahtev(id: string, napomena: string): Observable<any> {
  return this.http.put(
    `${this.API_URL}/zahtev/${id}/odbij`,
    { napomena },
    {
      headers: this.getHeaders(),
    }
  );
}

//druga funkcionalnost rasporedjivanje u grupe

// GRUPE

getGrupe(vrticID: string): Observable<Grupa[]> {
  return this.http.get<Grupa[]>(`${this.API_URL}/grupe/${vrticID}`, {
    headers: this.getHeaders(),
  });
}

getGrupaById(id: string): Observable<Grupa> {
  return this.http.get<Grupa>(`${this.API_URL}/grupa/${id}`, {
    headers: this.getHeaders(),
  });
}

dodajDeteUGrupu(deteID: string, grupaID: string): Observable<any> {
  return this.http.post(
    `${this.API_URL}/grupa/dodaj-dete`,
    { deteID, grupaID },
    {
      headers: this.getHeaders(),
    }
  );
}


dodajGrupu(grupa: Grupa): Observable<Grupa> {
  return this.http.post<Grupa>(`${this.API_URL}/grupa`, grupa, {
    headers: this.getHeaders(),
  });
}

azurirajGrupu(id: string, grupa: Grupa): Observable<Grupa> {
  return this.http.put<Grupa>(`${this.API_URL}/grupa/${id}`, grupa, {
    headers: this.getHeaders(),
  });
}

obrisiGrupu(id: string): Observable<any> {
  return this.http.delete(`${this.API_URL}/grupa/${id}`, {
    headers: this.getHeaders(),
  });
}

// Evidencija prisustva
dodajPrisustvoDogadjaj(payload: {
  deteID: string;
  tipDogadjaja: "DOLAZAK" | "PREUZIMANJE";
  napomena?: string;
}): Observable<PrisustvoDogadjaj> {
  return this.http.post<PrisustvoDogadjaj>(
    `${this.API_URL}/prisustvo/dogadjaj`,
    payload,
    { headers: this.getHeaders() }
  );
}

getPrisustvoZaDete(deteID: string): Observable<PrisustvoDogadjaj[]> {
  return this.http.get<PrisustvoDogadjaj[]>(
    `${this.API_URL}/prisustvo?deteID=${encodeURIComponent(deteID)}`,
    { headers: this.getHeaders() }
  );
}

getPrisustvoMogDeteta(deteID: string): Observable<PrisustvoDogadjaj[]> {
  return this.http.get<PrisustvoDogadjaj[]>(
    `${this.API_URL}/prisustvo/moje-dete/${encodeURIComponent(deteID)}`,
    { headers: this.getHeaders() }
  );
}

}

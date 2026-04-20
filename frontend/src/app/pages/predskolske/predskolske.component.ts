import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  PredskolskeService,
  ZahtevZaUpis,
  Dete,
  Vrtic,
  Obavestenje,
} from "../../services/predskolske.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-predskolske",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="predskolske-container">
      <div class="page-header">
        <h1>🎓 Predškolske ustanove</h1>
        <p>Upis dece u vrtiće i upravljanje zahtevima</p>
      </div>

      <div class="navigation-buttons mb-30">
  <button class="btn btn-primary" routerLink="/predskolske/dodaj-dete">
    Dodaj dete
  </button>
  <button class="btn btn-secondary" routerLink="/predskolske/moje-dete">
    Moja deca
  </button>
  <button class="btn btn-info" routerLink="/predskolske/vrtici">
    Prikazi vrtiće
  </button>
</div>

      <div class="services-grid">
        <!-- Upis deteta -->
        <div class="card">
          <h3>👶 Zahtev za upis u vrtić</h3>
          <p class="hint-text">
            Izaberite dete koje ste već dodali u evidenciju i vrtić u koji želite upis.
            Deca koja su već upisana u vrtić ne pojavljuju se u listi.
          </p>
          <form (ngSubmit)="podnesZahtev()" #zahtevForm="ngForm">
            <div class="form-section">
              <h4>Dete</h4>
              <div class="form-group">
                <label for="deteZahtev">Izaberite dete</label>
                <select
                  id="deteZahtev"
                  name="deteZahtev"
                  class="form-control"
                  [(ngModel)]="zahtevFormular.deteId"
                  required
                >
                  <option value="">— izaberite dete —</option>
                  <option *ngFor="let d of decaZaZahtev" [value]="d.id">
                    {{ d.ime }} {{ d.prezime }} (JMBG: {{ d.jmbg }})
                  </option>
                </select>
              </div>
              <p *ngIf="deca.length > 0 && decaZaZahtev.length === 0" class="text-muted small">
                Sva vaša deca su već upisana u vrtić ili nemaju ID u sistemu.
              </p>
              <p *ngIf="deca.length === 0" class="text-muted small">
                Nemate unetog deteta.
                <a routerLink="/predskolske/dodaj-dete">Dodaj dete</a>
              </p>
            </div>

            <div class="form-section">
              <h4>Izbor vrtića</h4>

              <div class="form-group">
                <label for="vrtic">Vrtić</label>
                <select
                  id="vrtic"
                  name="vrtic"
                  class="form-control"
                  [(ngModel)]="zahtevFormular.vrticId"
                  required
                >
                  <option value="">Izaberite vrtić</option>
                  <option *ngFor="let vrtic of vrtici" [value]="vrtic.id">
                    {{ vrtic.naziv }} ({{
                      vrtic.brojSlobodnihMesta
                    }}
                    slobodnih mesta)
                  </option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              class="btn btn-success"
              [disabled]="!zahtevForm.form.valid || isLoading || decaZaZahtev.length === 0"
            >
              {{ isLoading ? "Podnošenje zahteva..." : "Podnesi zahtev" }}
            </button>
          </form>

          <div *ngIf="zahtevStatus" [ngClass]="zahtevStatus.type" class="alert">
            {{ zahtevStatus.message }}
          </div>
        </div>

        <!-- Lista vrtića -->
        <div class="card">
          <h3>🏫 Dostupni vrtići</h3>
          <button class="btn btn-secondary mb-20" (click)="loadVrtici()">
            Osvezi listu vrtića
          </button>

          <div *ngIf="vrtici.length > 0" class="vrtici-lista">
            <div *ngFor="let vrtic of vrtici" class="vrtic-item">
              <h5>{{ vrtic.naziv }}</h5>
              <p><strong>Kapacitet:</strong> {{ vrtic.kapacitet }}</p>
              <p>
                <strong>Slobodna mesta:</strong>
                <span
                  [class]="
                    vrtic.brojSlobodnihMesta > 0 ? 'text-success' : 'text-danger'
                  "
                >
                  {{ vrtic.brojSlobodnihMesta }}
                </span>
              </p>
            </div>
          </div>

          <div *ngIf="vrticiStatus" [ngClass]="vrticiStatus.type" class="alert">
            {{ vrticiStatus.message }}
          </div>
        </div>

        <!-- Test funkcionalnosti -->
        <div class="card">
          <h3>🔧 Test funkcionalnosti</h3>
          <div class="test-buttons">
            <button class="btn btn-secondary" (click)="testAPI()">
              Test API
            </button>
          </div>

          <div *ngIf="testStatus" [ngClass]="testStatus.type" class="alert">
            {{ testStatus.message }}
          </div>
        </div>
      </div>


<div class="card">
  <h3>👶 Moja deca</h3>

  <div *ngIf="deca.length > 0">
    <div *ngFor="let d of deca" class="vrtic-item">
      <p><strong>Ime:</strong> {{ d.ime }} {{ d.prezime }}</p>
      <p><strong>JMBG:</strong> {{ d.jmbg }}</p>
      <button class="btn btn-danger btn-sm" (click)="obrisiDete(d.id!)">
  Obriši
</button>
    </div>
  </div>

  <div *ngIf="deca.length === 0">
    <p>Nema dodate dece.</p>
  </div>
</div>




<div class="card">
  <h3>📋 Moji zahtevi</h3>

  <div *ngIf="zahtevi.length > 0">
    <div *ngFor="let z of zahtevi" class="vrtic-item">
      <p><strong>Dete:</strong> {{ getDetePrikazZaZahtev(z.deteId) }}</p>
      <p><strong>Vrtić:</strong> {{ getVrticNaziv(z.vrticId) }}</p>
      <p><strong>Status:</strong> {{ z.status || 'NA_CEKANJU' }}</p>
      <p *ngIf="z.status === 'ODBIJEN' && z.napomena" class="text-danger">
        <strong>Poruka:</strong> {{ z.napomena }}
      </p>
    </div>
  </div>

  <div *ngIf="zahtevi.length === 0">
    <p>Nema poslatih zahteva.</p>
  </div>
</div>

<div class="card">
  <h3>🔔 Moja obaveštenja</h3>

  <div *ngIf="obavestenja.length > 0">
    <div *ngFor="let o of obavestenja" class="vrtic-item">
      <p><strong>Poruka:</strong> {{ o.poruka }}</p>
      <p><strong>Vreme:</strong> {{ o.createdAt | date : "dd.MM.yyyy HH:mm:ss" }}</p>
    </div>
  </div>

  <div *ngIf="obavestenja.length === 0">
    <p>Trenutno nema obaveštenja.</p>
  </div>
</div>


      <div class="card mt-20" *ngIf="!authService.isLoggedIn()">
        <div class="alert alert-info">
          ℹ️ Za pristup svim funkcionalnostima, molimo
          <a routerLink="/auth">prijavite se</a>.
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .predskolske-container {
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        text-align: center;
        margin-bottom: 40px;
      }

      .page-header h1 {
        color: #2c3e50;
        font-size: 2.5rem;
        margin-bottom: 8px;
      }

      .navigation-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

      .page-header p {
        color: #666;
        font-size: 1.1rem;
      }

      .services-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        gap: 24px;
      }

      .card h3 {
        color: #2c3e50;
        margin-bottom: 20px;
        font-size: 1.3rem;
      }

      .form-section {
        margin-bottom: 24px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
      }

      .form-section:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      .form-section h4 {
        color: #34495e;
        margin-bottom: 16px;
        font-size: 1.1rem;
      }

      .test-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      .vrtici-lista {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .vrtic-item {
        background: #f8f9fa;
        padding: 16px;
        border-radius: 6px;
        border-left: 4px solid #3498db;
      }

      .vrtic-item h5 {
        color: #2c3e50;
        margin: 0 0 8px 0;
        font-size: 1.1rem;
      }

      .vrtic-item p {
        margin: 4px 0;
        font-size: 14px;
      }

      .text-success {
        color: #27ae60;
        font-weight: 600;
      }

      .text-danger {
        color: #e74c3c;
        font-weight: 600;
      }

      .hint-text {
        color: #555;
        font-size: 0.95rem;
        margin-bottom: 1rem;
        line-height: 1.45;
      }

      .text-muted {
        color: #666;
      }

      .small {
        font-size: 0.9rem;
      }

      @media (max-width: 768px) {
        .services-grid {
          grid-template-columns: 1fr;
        }

        .page-header h1 {
          font-size: 2rem;
        }

        .test-buttons {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class PredskolskeComponent implements OnInit {
  private predskolskeService = inject(PredskolskeService);
  authService = inject(AuthService);

  /** Samo zahtev: postojeće dete + vrtić (bez kreiranja novog deteta na ovoj stranici). */
  zahtevFormular = {
    deteId: "",
    vrticId: "",
  };

  /** Deca roditelja koja još nisu upisana u vrtić (nema smislenog vrticID). */
  get decaZaZahtev(): Dete[] {
    return this.deca.filter((d) => {
      const v = d.vrticID?.trim();
      return !!d.id && !v;
    });
  }

  vrtici: Vrtic[] = [];
  isLoading = false;

  deca: Dete[] = [];
  zahtevi: ZahtevZaUpis[] = [];
  obavestenja: Obavestenje[] = [];

  zahtevStatus: { type: string; message: string } | null = null;
  vrticiStatus: { type: string; message: string } | null = null;
  testStatus: { type: string; message: string } | null = null;

  ngOnInit() {
    this.loadVrtici();
    this.loadMojaDeca();
    this.loadMojaObavestenja();
  }

  podnesZahtev() {
    if (!this.zahtevFormular.deteId || !this.zahtevFormular.vrticId) {
      this.zahtevStatus = {
        type: "alert-error",
        message: "Izaberite dete i vrtić.",
      };
      return;
    }

    this.isLoading = true;
    this.zahtevStatus = null;

    const zahtev: ZahtevZaUpis = {
      deteId: this.zahtevFormular.deteId,
      vrticId: this.zahtevFormular.vrticId,
    };

    this.predskolskeService.dodajZahtev(zahtev).subscribe({
      next: () => {
        this.isLoading = false;
        this.zahtevStatus = {
          type: "alert-success",
          message: "✅ Zahtev uspešno podnet!",
        };
        this.resetZahtevForm();
        this.loadVrtici();
        this.loadMojiZahtevi();
      },
      error: (error: { error?: { error?: string }; message?: string }) => {
        this.isLoading = false;
        const msg =
          error.error?.error ||
          error.message ||
          "Greška pri podnošenju zahteva.";
        this.zahtevStatus = {
          type: "alert-error",
          message: `❌ ${msg}`,
        };
      },
    });
  }


  loadVrtici() {
    this.predskolskeService.getVrtici().subscribe({
      next: (vrtici) => {
        this.vrtici = vrtici;
        this.vrticiStatus = {
          type: "alert-success",
          message: `✅ Učitano ${vrtici.length} vrtića`,
        };
      },
      error: (error) => {
        this.vrticiStatus = {
          type: "alert-error",
          message: `❌ Greška pri učitavanju vrtića: ${error.message}`,
        };
        // Set default vrtici for demo
        this.vrtici = [
          {
            id: "1",
            naziv: 'Vrtić "Sunce"',
            kapacitet: 100,
            brojSlobodnihMesta: 15,
          },
          {
            id: "2",
            naziv: 'Vrtić "Duga"',
            kapacitet: 80,
            brojSlobodnihMesta: 8,
          },
          {
            id: "3",
            naziv: 'Vrtić "Cveće"',
            kapacitet: 120,
            brojSlobodnihMesta: 0,
          },
        ];
      },
    });
  }

  testAPI() {
    this.predskolskeService.testAPI().subscribe({
      next: (response) => {
        this.testStatus = {
          type: "alert-success",
          message: `✅ Predškolske API radi: ${response.message}`,
        };
      },
      error: (error) => {
        this.testStatus = {
          type: "alert-error",
          message: `❌ Predškolske API ne radi: ${error.message}`,
        };
      },
    });
  }

//deca

loadMojaDeca() {
  this.predskolskeService.getMojaDeca().subscribe({
    next: (data) => {
      this.deca = data;
      this.loadMojiZahtevi();
    },
    error: (err) => {
      console.error("Greška pri učitavanju dece", err);
    },
  });
}

obrisiDete(deteId: string) {
  this.predskolskeService.obrisiDete(deteId).subscribe({
    next: () => {
      this.deca = this.deca.filter(d => d.id !== deteId);
    },
    error: (err) => console.error("Greška pri brisanju deteta", err),
  });
}

//zahtevi

loadMojiZahtevi() {
  const mojaDecaIds = new Set(this.deca.map((d) => d.id).filter((id): id is string => !!id));
  this.predskolskeService.getZahtevi().subscribe({
    next: (data) => {
      this.zahtevi = data.filter((z) => mojaDecaIds.has(z.deteId));
    },
    error: (err) => {
      console.error("Greška pri učitavanju zahteva", err);
    },
  });
}

loadMojaObavestenja() {
  this.predskolskeService.getMojaObavestenja().subscribe({
    next: (data) => {
      this.obavestenja = data;
    },
    error: (err) => {
      console.error("Greška pri učitavanju obaveštenja", err);
    },
  });
}

getVrticNaziv(vrticId: string): string {
  const vrtic = this.vrtici.find((v) => v.id === vrticId);
  return vrtic ? vrtic.naziv : vrticId;
}

getDetePrikazZaZahtev(deteId: string): string {
  const d = this.deca.find((x) => x.id === deteId);
  if (d) {
    return `${d.ime} ${d.prezime}`.trim();
  }
  return deteId ? `ID: ${deteId}` : "—";
}



  private resetZahtevForm() {
    this.zahtevFormular = {
      deteId: "",
      vrticId: "",
    };
  }
}
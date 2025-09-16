import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  PredskolskeService,
  ZahtevZaUpis,
  Dete,
  Vrtic,
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

      <div class="services-grid">
        <!-- Upis deteta -->
        <div class="card">
          <h3>👶 Upis deteta u vrtić</h3>
          <form (ngSubmit)="podnesZahtev()" #zahtevForm="ngForm">
            <div class="form-section">
              <h4>Podaci o detetu</h4>

              <div class="form-group">
                <label for="ime">Ime deteta</label>
                <input
                  type="text"
                  id="ime"
                  name="ime"
                  class="form-control"
                  [(ngModel)]="noviZahtev.dete.ime"
                  required
                  placeholder="Marko"
                />
              </div>

              <div class="form-group">
                <label for="prezime">Prezime deteta</label>
                <input
                  type="text"
                  id="prezime"
                  name="prezime"
                  class="form-control"
                  [(ngModel)]="noviZahtev.dete.prezime"
                  required
                  placeholder="Petrović"
                />
              </div>

              <div class="form-group">
                <label for="jmbgDeteta">JMBG deteta</label>
                <input
                  type="text"
                  id="jmbgDeteta"
                  name="jmbgDeteta"
                  class="form-control"
                  [(ngModel)]="noviZahtev.dete.jmbg"
                  required
                  maxlength="13"
                  placeholder="1234567890123"
                />
              </div>

              <div class="form-group">
                <label for="datumRodjenja">Datum rođenja</label>
                <input
                  type="date"
                  id="datumRodjenja"
                  name="datumRodjenja"
                  class="form-control"
                  [(ngModel)]="noviZahtev.dete.datumRodj"
                  required
                />
              </div>

            </div>

            <div class="form-section">
              <h4>Izbor vrtića</h4>

              <div class="form-group">
                <label for="vrtic">Vrtić</label>
                <select
                  id="vrtic"
                  name="vrtic"
                  class="form-control"
                  [(ngModel)]="noviZahtev.vrticId"
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
              [disabled]="!zahtevForm.form.valid || isLoading"
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
            <button class="btn btn-secondary" (click)="testService()">
              Test Predškolske servisa
            </button>
            <button class="btn btn-secondary" (click)="testAPI()">
              Test API
            </button>
          </div>

          <div *ngIf="testStatus" [ngClass]="testStatus.type" class="alert">
            {{ testStatus.message }}
          </div>
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

  noviZahtev: ZahtevZaUpis = {
    dete: {
      ime: "",
      prezime: "",
      jmbg: "",
      datumRodj: "",
      korisnikId: "",
    },
    vrticId: "",
  };

  vrtici: Vrtic[] = [];
  isLoading = false;

  zahtevStatus: { type: string; message: string } | null = null;
  vrticiStatus: { type: string; message: string } | null = null;
  testStatus: { type: string; message: string } | null = null;

  ngOnInit() {
    this.loadVrtici();
  }

  podnesZahtev() {
    this.isLoading = true;
    this.zahtevStatus = null;

    this.predskolskeService.podnesZahtev(this.noviZahtev).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.zahtevStatus = {
          type: "alert-success",
          message: "✅ Zahtev za upis je uspešno podnet!",
        };
        this.resetZahtevForm();
        this.loadVrtici(); // Refresh vrtici list
      },
      error: (error) => {
        this.isLoading = false;
        this.zahtevStatus = {
          type: "alert-error",
          message: `❌ Greška: ${error.error?.message || error.message}`,
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

  testService() {
    this.predskolskeService.testService().subscribe({
      next: (response) => {
        this.testStatus = {
          type: "alert-success",
          message: `✅ Predškolske servis radi: ${response.status}`,
        };
      },
      error: (error) => {
        this.testStatus = {
          type: "alert-error",
          message: `❌ Predškolske servis ne radi: ${error.message}`,
        };
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

  private resetZahtevForm() {
    this.noviZahtev = {
      dete: {
        ime: "",
        prezime: "",
        jmbg: "",
        datumRodj: "",
        korisnikId: "",
      },
      vrticId: "",
    };
  }
}
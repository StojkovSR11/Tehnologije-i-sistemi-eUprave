import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  ZdravstvoService,
  Pregled,
  Uput,
} from "../../services/zdravstvo.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-zdravstvo",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="zdravstvo-container">
      <div class="page-header">
        <h1>🏥 Zdravstvo</h1>
        <p>Upravljanje zdravstvenim uslugama i pregledi</p>
      </div>

      <div class="services-grid">
        <!-- Zakazivanje pregleda -->
        <div class="card">
          <h3>📅 Zakazivanje pregleda</h3>
          <form (ngSubmit)="zakaziPregled()" #pregledForm="ngForm">
            <div class="form-group">
              <label for="jmbg">JMBG pacijenta</label>
              <input
                type="text"
                id="jmbg"
                name="jmbg"
                class="form-control"
                [(ngModel)]="noviPregled.jmbg"
                required
                maxlength="13"
                placeholder="1234567890123"
              />
            </div>

            <div class="form-group">
              <label for="doktor">Doktor</label>
              <select
                id="doktor"
                name="doktor"
                class="form-control"
                [(ngModel)]="noviPregled.doktor"
                required
              >
                <option value="">Izaberite doktora</option>
                <option value="Dr. Marko Petrović">Dr. Marko Petrović</option>
                <option value="Dr. Ana Jovanović">Dr. Ana Jovanović</option>
                <option value="Dr. Stefan Nikolić">Dr. Stefan Nikolić</option>
              </select>
            </div>

            <div class="form-group">
              <label for="datum">Datum</label>
              <input
                type="date"
                id="datum"
                name="datum"
                class="form-control"
                [(ngModel)]="noviPregled.datum"
                required
              />
            </div>

            <div class="form-group">
              <label for="vreme">Vreme</label>
              <input
                type="time"
                id="vreme"
                name="vreme"
                class="form-control"
                [(ngModel)]="noviPregled.vreme"
                required
              />
            </div>

            <div class="form-group">
              <label for="tip">Tip pregleda</label>
              <select
                id="tip"
                name="tip"
                class="form-control"
                [(ngModel)]="noviPregled.tip"
                required
              >
                <option value="">Izaberite tip</option>
                <option value="Kontrolni pregled">Kontrolni pregled</option>
                <option value="Specijalistički pregled">
                  Specijalistički pregled
                </option>
                <option value="Preventivni pregled">Preventivni pregled</option>
              </select>
            </div>

            <button
              type="submit"
              class="btn btn-success"
              [disabled]="!pregledForm.form.valid || isLoading"
            >
              {{ isLoading ? "Zakazivanje..." : "Zakaži pregled" }}
            </button>
          </form>

          <div
            *ngIf="pregledStatus"
            [ngClass]="pregledStatus.type"
            class="alert"
          >
            {{ pregledStatus.message }}
          </div>
        </div>

        <!-- Kreiranje uputa -->
        <div class="card">
          <h3>📋 Kreiranje uputa</h3>
          <form (ngSubmit)="kreirajUput()" #uputForm="ngForm">
            <div class="form-group">
              <label for="uputJmbg">JMBG pacijenta</label>
              <input
                type="text"
                id="uputJmbg"
                name="uputJmbg"
                class="form-control"
                [(ngModel)]="noviUput.jmbg"
                required
                maxlength="13"
                placeholder="1234567890123"
              />
            </div>

            <div class="form-group">
              <label for="lekar">Lekar koji izdaje uput</label>
              <input
                type="text"
                id="lekar"
                name="lekar"
                class="form-control"
                [(ngModel)]="noviUput.lekar"
                required
                placeholder="Dr. Ime Prezime"
              />
            </div>

            <div class="form-group">
              <label for="specijalista">Specijalista</label>
              <select
                id="specijalista"
                name="specijalista"
                class="form-control"
                [(ngModel)]="noviUput.specijalista"
                required
              >
                <option value="">Izaberite specijalnost</option>
                <option value="Kardiolog">Kardiolog</option>
                <option value="Neurolog">Neurolog</option>
                <option value="Dermatolog">Dermatolog</option>
                <option value="Ortoped">Ortoped</option>
              </select>
            </div>

            <div class="form-group">
              <label for="dijagnoza">Dijagnoza</label>
              <textarea
                id="dijagnoza"
                name="dijagnoza"
                class="form-control"
                [(ngModel)]="noviUput.dijagnoza"
                required
                rows="3"
                placeholder="Unesite dijagnozu..."
              ></textarea>
            </div>

            <div class="form-group">
              <label for="uputDatum">Datum izdavanja</label>
              <input
                type="date"
                id="uputDatum"
                name="uputDatum"
                class="form-control"
                [(ngModel)]="noviUput.datum"
                required
              />
            </div>

            <button
              type="submit"
              class="btn btn-success"
              [disabled]="!uputForm.form.valid || isLoading"
            >
              {{ isLoading ? "Kreiranje..." : "Kreiraj uput" }}
            </button>
          </form>

          <div *ngIf="uputStatus" [ngClass]="uputStatus.type" class="alert">
            {{ uputStatus.message }}
          </div>
        </div>

        <!-- Validacija zdravstvene knjižice -->
        <div class="card">
          <h3>✅ Validacija zdravstvene knjižice</h3>
          <div class="form-group">
            <label for="validacijaJmbg">JMBG za validaciju</label>
            <input
              type="text"
              id="validacijaJmbg"
              class="form-control"
              [(ngModel)]="validacijaJmbg"
              maxlength="13"
              placeholder="1234567890123"
            />
          </div>

          <button
            class="btn"
            (click)="validacijaZdravstveneKnjizice()"
            [disabled]="!validacijaJmbg || isLoading"
          >
            Validacija
          </button>

          <div
            *ngIf="validacijaStatus"
            [ngClass]="validacijaStatus.type"
            class="alert"
          >
            {{ validacijaStatus.message }}
          </div>
        </div>

        <!-- Test funkcionalnosti -->
        <div class="card">
          <h3>🔧 Test funkcionalnosti</h3>
          <div class="test-buttons">
            <button class="btn btn-secondary" (click)="testService()">
              Test Zdravstvo servisa
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
      .zdravstvo-container {
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

      .test-buttons {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
      }

      textarea.form-control {
        resize: vertical;
        min-height: 80px;
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
export class ZdravstvoComponent {
  private zdravstvoService = inject(ZdravstvoService);
  authService = inject(AuthService);

  noviPregled: Pregled = {
    jmbg: "",
    doktor: "",
    datum: "",
    vreme: "",
    tip: "",
  };

  noviUput: Uput = {
    jmbg: "",
    lekar: "",
    specijalista: "",
    dijagnoza: "",
    datum: "",
  };

  validacijaJmbg = "";
  isLoading = false;

  pregledStatus: { type: string; message: string } | null = null;
  uputStatus: { type: string; message: string } | null = null;
  validacijaStatus: { type: string; message: string } | null = null;
  testStatus: { type: string; message: string } | null = null;

  zakaziPregled() {
    this.isLoading = true;
    this.pregledStatus = null;

    this.zdravstvoService.zakaziPregled(this.noviPregled).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.pregledStatus = {
          type: "alert-success",
          message: "✅ Pregled je uspešno zakazan!",
        };
        this.resetPregledForm();
      },
      error: (error) => {
        this.isLoading = false;
        this.pregledStatus = {
          type: "alert-error",
          message: `❌ Greška: ${error.error?.message || error.message}`,
        };
      },
    });
  }

  kreirajUput() {
    this.isLoading = true;
    this.uputStatus = null;

    this.zdravstvoService.kreirajUput(this.noviUput).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.uputStatus = {
          type: "alert-success",
          message: "✅ Uput je uspešno kreiran!",
        };
        this.resetUputForm();
      },
      error: (error) => {
        this.isLoading = false;
        this.uputStatus = {
          type: "alert-error",
          message: `❌ Greška: ${error.error?.message || error.message}`,
        };
      },
    });
  }

  validacijaZdravstveneKnjizice() {
    if (!this.validacijaJmbg) return;

    this.isLoading = true;
    this.validacijaStatus = null;

    this.zdravstvoService
      .validacijaZdravstveneKnjizice(this.validacijaJmbg)
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          this.validacijaStatus = {
            type: "alert-success",
            message: `✅ Zdravstvena knjižica je ${
              response.valid ? "validna" : "nevalidna"
            }`,
          };
        },
        error: (error) => {
          this.isLoading = false;
          this.validacijaStatus = {
            type: "alert-error",
            message: `❌ Greška: ${error.error?.message || error.message}`,
          };
        },
      });
  }

  testService() {
    this.zdravstvoService.testService().subscribe({
      next: (response) => {
        this.testStatus = {
          type: "alert-success",
          message: `✅ Zdravstvo servis radi: ${response.status}`,
        };
      },
      error: (error) => {
        this.testStatus = {
          type: "alert-error",
          message: `❌ Zdravstvo servis ne radi: ${error.message}`,
        };
      },
    });
  }

  testAPI() {
    this.zdravstvoService.testAPI().subscribe({
      next: (response) => {
        this.testStatus = {
          type: "alert-success",
          message: `✅ Zdravstvo API radi: ${response.message}`,
        };
      },
      error: (error) => {
        this.testStatus = {
          type: "alert-error",
          message: `❌ Zdravstvo API ne radi: ${error.message}`,
        };
      },
    });
  }

  private resetPregledForm() {
    this.noviPregled = {
      jmbg: "",
      doktor: "",
      datum: "",
      vreme: "",
      tip: "",
    };
  }

  private resetUputForm() {
    this.noviUput = {
      jmbg: "",
      lekar: "",
      specijalista: "",
      dijagnoza: "",
      datum: "",
    };
  }
}

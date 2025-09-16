import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { ZdravstvoService } from "../../services/zdravstvo.service";
import { PredskolskeService } from "../../services/predskolske.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero">
      <h1>Dobrodošli u eGovernment Portal</h1>
      <p>Pristupite digitalnim servisima Republike Srbije jednostavno i brzo</p>
    </div>

    <div class="services grid grid-2">
      <div class="card service-card">
        <h3>🔐 Autentifikacija</h3>
        <p>SSO prijava za sve državne servise</p>
        <div class="service-actions">
          <a routerLink="/auth" class="btn">Prijavite se</a>
          <button class="btn btn-secondary" (click)="testAuth()">
            Test servis
          </button>
        </div>
        <div *ngIf="authStatus" [ngClass]="authStatus.type" class="alert">
          {{ authStatus.message }}
        </div>
      </div>

      <div class="card service-card">
        <h3>🏥 Zdravstvo</h3>
        <p>Zakazivanje pregleda, uputi, zdravstvena knjižica</p>
        <div class="service-actions">
          <a routerLink="/zdravstvo" class="btn">Otvori servis</a>
          <button class="btn btn-secondary" (click)="testZdravstvo()">
            Test servis
          </button>
        </div>
        <div
          *ngIf="zdravstvoStatus"
          [ngClass]="zdravstvoStatus.type"
          class="alert"
        >
          {{ zdravstvoStatus.message }}
        </div>
      </div>

      <div class="card service-card">
        <h3>🎓 Predškolske ustanove</h3>
        <p>Upis u vrtić, zahtevi, potvrde</p>
        <div class="service-actions">
          <a routerLink="/predskolske" class="btn">Otvori servis</a>
          <button class="btn btn-secondary" (click)="testPredskolske()">
            Test servis
          </button>
        </div>
        <div
          *ngIf="predskolskeStatus"
          [ngClass]="predskolskeStatus.type"
          class="alert"
        >
          {{ predskolskeStatus.message }}
        </div>
      </div>

      <div class="card service-card">
        <h3>🔧 Status sistema</h3>
        <p>Provera rada svih servisa</p>
        <div class="service-actions">
          <button class="btn" (click)="testAllServices()">
            Test svih servisa
          </button>
        </div>
        <div *ngIf="systemStatus" [ngClass]="systemStatus.type" class="alert">
          {{ systemStatus.message }}
        </div>
      </div>
    </div>

    <div class="card mt-20" *ngIf="authService.isLoggedIn()">
      <h3>Brzi pristup</h3>
      <p>
        Ulogovani ste kao:
        <strong>{{ authService.getCurrentUser()?.name }}</strong>
      </p>
      <div class="service-actions">
        <a routerLink="/zdravstvo" class="btn btn-success">Zakažite pregled</a>
        <a routerLink="/predskolske" class="btn btn-success">Upišite dete</a>
      </div>
    </div>

<div class="container">
  <h1>Dobrodošli na eUprava aplikaciju</h1>

  <div class="dugmad">
    <a routerLink="/login">
      <button>Prijava</button>
    </a>

    <a routerLink="/register">
      <button>Registracija</button>
    </a>
  </div>
</div>


  `,
  styles: [
    `
      .hero {
        text-align: center;
        padding: 40px 0;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 12px;
        margin-bottom: 40px;
      }

      .hero h1 {
        font-size: 2.5rem;
        margin-bottom: 16px;
        font-weight: 600;
      }

      .hero p {
        font-size: 1.2rem;
        opacity: 0.9;
      }

      .service-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }

      .service-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .service-card h3 {
        color: #2c3e50;
        margin-bottom: 12px;
        font-size: 1.4rem;
      }

      .service-card p {
        color: #666;
        margin-bottom: 20px;
        line-height: 1.6;
      }

      .service-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-bottom: 15px;
      }

      @media (max-width: 768px) {
        .hero h1 {
          font-size: 2rem;
        }

        .hero p {
          font-size: 1rem;
        }

        .service-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class HomeComponent implements OnInit {
  authService = inject(AuthService);
  private zdravstvoService = inject(ZdravstvoService);
  private predskolskeService = inject(PredskolskeService);

  authStatus: { type: string; message: string } | null = null;
  zdravstvoStatus: { type: string; message: string } | null = null;
  predskolskeStatus: { type: string; message: string } | null = null;
  systemStatus: { type: string; message: string } | null = null;

  ngOnInit() {
    // Auto-test services on load
    this.testAllServices();
  }

  testAuth() {
    this.authService.testService().subscribe({
      next: (response) => {
        this.authStatus = {
          type: "alert-success",
          message: `✅ Auth servis: ${response.status}`,
        };
      },
      error: (error) => {
        this.authStatus = {
          type: "alert-error",
          message: `❌ Auth servis: ${error.message}`,
        };
      },
    });
  }

  testZdravstvo() {
    this.zdravstvoService.testService().subscribe({
      next: (response) => {
        this.zdravstvoStatus = {
          type: "alert-success",
          message: `✅ Zdravstvo servis: ${response.status}`,
        };
      },
      error: (error) => {
        this.zdravstvoStatus = {
          type: "alert-error",
          message: `❌ Zdravstvo servis: ${error.message}`,
        };
      },
    });
  }

  testPredskolske() {
    this.predskolskeService.testService().subscribe({
      next: (response) => {
        this.predskolskeStatus = {
          type: "alert-success",
          message: `✅ Predškolske servis: ${response.status}`,
        };
      },
      error: (error) => {
        this.predskolskeStatus = {
          type: "alert-error",
          message: `❌ Predškolske servis: ${error.message}`,
        };
      },
    });
  }

  testAllServices() {
    this.systemStatus = {
      type: "alert-info",
      message: "Testiranje svih servisa...",
    };

    this.testAuth();
    this.testZdravstvo();
    this.testPredskolske();

    setTimeout(() => {
      this.systemStatus = {
        type: "alert-success",
        message: "✅ Testiranje završeno",
      };
    }, 2000);
  }
}

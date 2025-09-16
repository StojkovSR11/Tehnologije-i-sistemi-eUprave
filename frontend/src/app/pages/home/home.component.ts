import { Component, inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { RoleService, UserRole } from "../../services/role.service";
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

    <!-- Ukoliko korisnik nije ulogovan -->
    <div *ngIf="!authService.isLoggedIn()" class="services grid grid-2">
      <div class="card service-card">
        <h3>🔐 Prijava</h3>
        <p>Prijavite se za pristup eGovernment servisima</p>
        <div class="service-actions">
          <a routerLink="/login" class="btn">Prijavite se</a>
          <a routerLink="/register" class="btn btn-secondary">Registrujte se</a>
        </div>
      </div>
    </div>

    <!-- Servisi za ulogovane korisnike -->
    <div *ngIf="authService.isLoggedIn()" class="services grid grid-2">
      
      <!-- Admin panel - samo za administratore -->
      <div *ngIf="roleService.isAdmin()" class="card service-card admin-card">
        <h3>⚙️ Admin Panel</h3>
        <p>Upravljanje korisnicima i sistemom</p>
        <div class="service-actions">
          <a routerLink="/admin" class="btn btn-danger">Admin Panel</a>
          <button class="btn btn-secondary" (click)="testAllServices()">
            Test svih servisa
          </button>
        </div>
        <div *ngIf="systemStatus" [ngClass]="systemStatus.type" class="alert">
          {{ systemStatus.message }}
        </div>
      </div>

      <!-- Zdravstvo - osnovne funkcionalnosti za građane, napredne za lekare -->
      <div *ngIf="roleService.canAccessBasicServices()" class="card service-card">
        <h3>🏥 Zdravstvo</h3>
        <p *ngIf="roleService.isCitizen()">Zakazivanje pregleda, zdravstvena knjižica</p>
        <p *ngIf="roleService.isDoctor()">Upravljanje pacijentima, medicinski izveštaji</p>
        <p *ngIf="roleService.isAdmin()">Potpuno upravljanje zdravstvenim sistemom</p>
        <div class="service-actions">
          <a routerLink="/zdravstvo" class="btn">Otvori servis</a>
          <a *ngIf="roleService.canAccessHealthAdvanced()" routerLink="/zdravstvo/admin" class="btn btn-success">
            Napredne opcije
          </a>
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

      <!-- Predškolske ustanove - osnovne funkcionalnosti za građane -->
      <div *ngIf="roleService.canAccessBasicServices()" class="card service-card">
        <h3>🎓 Predškolske ustanove</h3>
        <p *ngIf="roleService.isCitizen()">Upis u vrtić, zahtevi, potvrde</p>
        <p *ngIf="roleService.isAdmin()">Upravljanje vrtićima i zahtevima</p>
        <div class="service-actions">
          <a routerLink="/predskolske" class="btn">Otvori servis</a>
          <a *ngIf="roleService.canAccessPreschoolAdvanced()" routerLink="/predskolske/admin" class="btn btn-success">
            Upravljanje
          </a>
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

      <!-- Autentifikacija - test servisa -->
      <div class="card service-card">
        <h3>🔐 Autentifikacija</h3>
        <p>Status autentifikacije i test servisa</p>
        <div class="service-actions">
          <button class="btn btn-secondary" (click)="testAuth()">
            Test servis
          </button>
          <button class="btn btn-danger" (click)="logout()">
            Odjavi se
          </button>
        </div>
        <div *ngIf="authStatus" [ngClass]="authStatus.type" class="alert">
          {{ authStatus.message }}
        </div>
      </div>
    </div>

    <div class="card mt-20" *ngIf="authService.isLoggedIn()">
      <h3>Korisnički profil</h3>
      <p>
        Ulogovani ste kao:
        <strong>{{ authService.getCurrentUser()?.name }}</strong>
        <span class="role-badge" [ngClass]="'role-' + authService.getCurrentUser()?.role">
          {{ authService.getCurrentUser()?.role }}
        </span>
      </p>
      <div class="service-actions" *ngIf="roleService.canAccessBasicServices()">
        <a routerLink="/zdravstvo" class="btn btn-success">Zakažite pregled</a>
        <a routerLink="/predskolske" class="btn btn-success">Upišite dete</a>
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
        background: white;
        border-radius: 12px;
        padding: 24px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: transform 0.2s, box-shadow 0.2s;
      }

      .service-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      }

      .admin-card {
        border-left: 4px solid #dc3545;
      }

      .role-badge {
        display: inline-block;
        padding: 4px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 500;
        margin-left: 8px;
        text-transform: uppercase;
      }

      .role-admin {
        background-color: #dc3545;
        color: white;
      }

      .role-citizen {
        background-color: #28a745;
        color: white;
      }

      .role-doctor {
        background-color: #007bff;
        color: white;
      }

      .mt-20 {
        margin-top: 20px;
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
  roleService = inject(RoleService);
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

  logout() {
    console.log("Logout");
    this.authService.logout().subscribe({
      next: () => {
        // Logout successful - user data is already cleared in the service
        this.authStatus = {
          type: "alert-success",
          message: "✅ Uspešno ste se odjavili"
        };
      },
      error: (error) => {
        // Even if server request fails, clear local data
        localStorage.removeItem("authToken");
        localStorage.removeItem("currentUser");
        this.authStatus = {
          type: "alert-warning",
          message: "⚠️ Odjavljeni ste lokalno (server nedostupan)"
        };
      }
    });
  }
}

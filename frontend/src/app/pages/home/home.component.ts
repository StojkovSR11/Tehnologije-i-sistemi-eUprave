import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { RoleService } from "../../services/role.service";

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
      <!-- Zdravstvo - osnovne funkcionalnosti za građane, napredne za lekare -->
      <div *ngIf="roleService.canAccessBasicServices()" class="card service-card">
        <h3>🏥 Zdravstvo</h3>
        <p *ngIf="roleService.isCitizen()">Zakazivanje pregleda, zdravstvena knjižica</p>
        <p *ngIf="roleService.isDoctor()">Upravljanje pacijentima, medicinski izveštaji</p>
        <p *ngIf="roleService.isAdmin()">Potpuno upravljanje zdravstvenim sistemom</p>
        <div class="service-actions">
          <a [routerLink]="zdravstvoServisLink" class="btn">{{ zdravstvoServisLabel }}</a>
        </div>
      </div>

      <!-- Predškolske ustanove - osnovne funkcionalnosti za građane -->
      <div *ngIf="roleService.canAccessBasicServices()" class="card service-card">
        <h3>🎓 Predškolske ustanove</h3>
        <p *ngIf="roleService.isCitizen()">Upis u vrtić, zahtevi, potvrde</p>
        <p *ngIf="roleService.isAdmin()">Upravljanje vrtićima i zahtevima</p>
        <div class="service-actions">
          <a [routerLink]="predskolskeServisLink" class="btn">{{ predskolskeServisLabel }}</a>
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
        <a [routerLink]="zdravstvoBrziLink" class="btn btn-success">{{ zdravstvoBrziLabel }}</a>
        <a [routerLink]="predskolskeBrziLink" class="btn btn-success">{{ predskolskeBrziLabel }}</a>
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
export class HomeComponent {
  authService = inject(AuthService);
  roleService = inject(RoleService);

  get predskolskeServisLink(): string {
    return this.roleService.canAccessPreschoolAdvanced()
      ? "/predskolske/admin"
      : "/predskolske";
  }

  get predskolskeServisLabel(): string {
    return this.roleService.canAccessPreschoolAdvanced()
      ? "Administratorski panel"
      : "Otvori servis";
  }

  get zdravstvoServisLink(): string {
    return this.roleService.canAccessHealthAdvanced()
      ? "/zdravstvo/admin"
      : "/zdravstvo";
  }

  get zdravstvoServisLabel(): string {
    return this.roleService.canAccessHealthAdvanced()
      ? "Upravljanje zdravstvom"
      : "Otvori servis";
  }

  get predskolskeBrziLink(): string {
    return this.roleService.canAccessPreschoolAdvanced()
      ? "/predskolske/admin"
      : "/predskolske";
  }

  get predskolskeBrziLabel(): string {
    return this.roleService.canAccessPreschoolAdvanced()
      ? "Predškolske – upravljanje"
      : "Upišite dete";
  }

  get zdravstvoBrziLink(): string {
    return this.roleService.canAccessHealthAdvanced()
      ? "/zdravstvo/admin"
      : "/zdravstvo";
  }

  get zdravstvoBrziLabel(): string {
    return this.roleService.canAccessHealthAdvanced()
      ? "Zdravstvo – upravljanje"
      : "Zakažite pregled";
  }
}

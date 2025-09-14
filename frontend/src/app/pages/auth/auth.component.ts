import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService, LoginRequest } from "../../services/auth.service";

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="card auth-card">
        <h2 class="text-center">🔐 Prijava u sistem</h2>
        <p class="text-center">
          Unesite vaše podatke za pristup eGovernment servisima
        </p>

        <form
          (ngSubmit)="login()"
          #loginForm="ngForm"
          *ngIf="!authService.isLoggedIn()"
        >
          <div class="form-group">
            <label for="jmbg">JMBG</label>
            <input
              type="text"
              id="jmbg"
              name="jmbg"
              class="form-control"
              placeholder="1234567890123"
              [(ngModel)]="credentials.jmbg"
              required
              maxlength="13"
              pattern="[0-9]{13}"
            />
          </div>

          <div class="form-group">
            <label for="password">Lozinka</label>
            <input
              type="password"
              id="password"
              name="password"
              class="form-control"
              placeholder="Unesite lozinku"
              [(ngModel)]="credentials.password"
              required
            />
          </div>

          <div class="form-group">
            <button
              type="submit"
              class="btn btn-block"
              [disabled]="!loginForm.form.valid || isLoading"
            >
              <span *ngIf="isLoading" class="loading"></span>
              {{ isLoading ? "Prijavljivanje..." : "Prijavite se" }}
            </button>
          </div>
        </form>

        <div *ngIf="authService.isLoggedIn()" class="logged-in-info">
          <div class="alert alert-success">
            ✅ Uspešno ste ulogovani kao:
            <strong>{{ authService.getCurrentUser()?.name }}</strong>
          </div>
          <div class="form-group">
            <button class="btn btn-danger btn-block" (click)="logout()">
              Odjavite se
            </button>
          </div>
        </div>

        <div *ngIf="status" [ngClass]="status.type" class="alert">
          {{ status.message }}
        </div>

        <div class="test-section">
          <h4>Test funkcionalnosti</h4>
          <button class="btn btn-secondary" (click)="testAuthService()">
            Test Auth servisa
          </button>
          <div *ngIf="testStatus" [ngClass]="testStatus.type" class="alert">
            {{ testStatus.message }}
          </div>
        </div>
      </div>

      <div class="card info-card">
        <h3>Demo podaci</h3>
        <p>Za testiranje možete koristiti sledeće podatke:</p>
        <div class="demo-credentials">
          <div class="demo-user">
            <strong>Građanin:</strong><br />
            JMBG: 1234567890123<br />
            Lozinka: password123
          </div>
          <div class="demo-user">
            <strong>Doktor:</strong><br />
            JMBG: 9876543210987<br />
            Lozinka: doctor123
          </div>
          <div class="demo-user">
            <strong>Admin:</strong><br />
            JMBG: 1111111111111<br />
            Lozinka: admin123
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .auth-container {
        max-width: 800px;
        margin: 0 auto;
        display: grid;
        gap: 20px;
        grid-template-columns: 1fr 1fr;
      }

      .auth-card {
        padding: 32px;
      }

      .auth-card h2 {
        color: #2c3e50;
        margin-bottom: 8px;
      }

      .auth-card p {
        color: #666;
        margin-bottom: 32px;
      }

      .btn-block {
        width: 100%;
      }

      .logged-in-info {
        text-align: center;
      }

      .test-section {
        margin-top: 32px;
        padding-top: 24px;
        border-top: 1px solid #eee;
      }

      .test-section h4 {
        color: #2c3e50;
        margin-bottom: 16px;
      }

      .info-card h3 {
        color: #2c3e50;
        margin-bottom: 16px;
      }

      .demo-credentials {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .demo-user {
        background: #f8f9fa;
        padding: 12px;
        border-radius: 6px;
        font-size: 14px;
        line-height: 1.5;
      }

      @media (max-width: 768px) {
        .auth-container {
          grid-template-columns: 1fr;
        }

        .auth-card {
          padding: 24px;
        }
      }
    `,
  ],
})
export class AuthComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  credentials: LoginRequest = {
    jmbg: "",
    password: "",
  };

  isLoading = false;
  status: { type: string; message: string } | null = null;
  testStatus: { type: string; message: string } | null = null;

  login() {
    if (!this.credentials.jmbg || !this.credentials.password) {
      this.status = {
        type: "alert-error",
        message: "❌ Molimo unesite JMBG i lozinku",
      };
      return;
    }

    this.isLoading = true;
    this.status = null;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.status = {
          type: "alert-success",
          message: `✅ Uspešna prijava! Dobrodošli ${response.user.name}`,
        };

        // Redirect to home after successful login
        setTimeout(() => {
          this.router.navigate(["/"]);
        }, 1500);
      },
      error: (error) => {
        this.isLoading = false;
        this.status = {
          type: "alert-error",
          message: `❌ Greška pri prijavi: ${
            error.error?.error || error.message
          }`,
        };
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.status = {
          type: "alert-success",
          message: "✅ Uspešno ste se odjavili",
        };
        this.credentials = { jmbg: "", password: "" };
      },
      error: (error) => {
        this.status = {
          type: "alert-error",
          message: `❌ Greška pri odjavi: ${error.message}`,
        };
      },
    });
  }

  testAuthService() {
    this.authService.testService().subscribe({
      next: (response) => {
        this.testStatus = {
          type: "alert-success",
          message: `✅ Auth servis radi: ${response.status}`,
        };
      },
      error: (error) => {
        this.testStatus = {
          type: "alert-error",
          message: `❌ Auth servis ne radi: ${error.message}`,
        };
      },
    });
  }
}

import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <h1>🏛️ eGovernment Portal</h1>
            <p>Digitalni servisi za građane Republike Srbije</p>
          </div>

          <nav class="nav">
            <a
              routerLink="/"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: true }"
              class="nav-link"
            >
              🏠 Početna
            </a>
            <a
              routerLink="/zdravstvo"
              routerLinkActive="active"
              class="nav-link"
            >
              🏥 Zdravstvo
            </a>
            <a
              routerLink="/predskolske"
              routerLinkActive="active"
              class="nav-link"
            >
              🎓 Predškolske ustanove
            </a>
            <a routerLink="/auth" routerLinkActive="active" class="nav-link">
              🔐 Prijava
            </a>
          </nav>

          <div class="user-info" *ngIf="authService.isLoggedIn()">
            <span class="welcome"
              >Dobrodošli, {{ authService.getCurrentUser()?.name }}!</span
            >
            <button class="btn btn-secondary" (click)="logout()">
              Odjavi se
            </button>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 0;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
      }

      .logo h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }

      .logo p {
        margin: 4px 0 0 0;
        font-size: 14px;
        opacity: 0.9;
      }

      .nav {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
      }

      .nav-link {
        color: white;
        text-decoration: none;
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.3s ease;
        font-weight: 500;
      }

      .nav-link:hover {
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }

      .nav-link.active {
        background: rgba(255, 255, 255, 0.2);
      }

      .user-info {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .welcome {
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          text-align: center;
        }

        .nav {
          justify-content: center;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  authService = inject(AuthService);
  authStatus: { type: string; message: string } | null = null;

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

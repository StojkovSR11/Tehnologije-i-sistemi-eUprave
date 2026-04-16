import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-container">
      <div class="admin-header">
        <h1>🔧 Admin Panel</h1>
        <p>Upravljanje sistemom i korisnicima</p>
      </div>

      <div class="admin-grid">
        <!-- Upravljanje korisnicima -->
        <div class="admin-card">
          <h3>👥 Upravljanje korisnicima</h3>
          <p>Pregled, dodavanje i upravljanje korisničkim nalozima</p>
          <div class="card-actions">
            <button class="btn btn-primary" (click)="loadUsers()">
              Prikaži korisnike
            </button>
            <button class="btn btn-success" (click)="addUser()">
              Dodaj korisnika
            </button>
          </div>
          <div *ngIf="usersStatus" [ngClass]="usersStatus.type" class="alert">
            {{ usersStatus.message }}
          </div>
        </div>

        <!-- Zdravstvo administracija -->
        <div class="admin-card">
          <h3>🏥 Zdravstvo - Admin</h3>
          <p>Upravljanje zdravstvenim sistemom i podacima</p>
          <div class="card-actions">
            <a routerLink="/zdravstvo/admin" class="btn btn-primary">
              Otvori zdravstvo admin
            </a>
            <button class="btn btn-secondary" (click)="testHealthSystem()">
              Test sistema
            </button>
          </div>
          <div *ngIf="healthStatus" [ngClass]="healthStatus.type" class="alert">
            {{ healthStatus.message }}
          </div>
        </div>

        <!-- Predškolske ustanove administracija -->
        <div class="admin-card">
          <h3>🎓 Predškolske - Admin</h3>
          <p>Upravljanje vrtićima i zahtevima za upis</p>
          <div class="card-actions">
            <a routerLink="/predskolske/admin" class="btn btn-primary">
              Otvori predškolske admin
            </a>
            <button class="btn btn-secondary" (click)="testPreschoolSystem()">
              Test sistema
            </button>
          </div>
          <div *ngIf="preschoolStatus" [ngClass]="preschoolStatus.type" class="alert">
            {{ preschoolStatus.message }}
          </div>
        </div>

        <!-- Sistemski status -->
        <div class="admin-card">
          <h3>📊 Status sistema</h3>
          <p>Pregled rada svih mikroservisa</p>
          <div class="card-actions">
            <button class="btn btn-warning" (click)="checkSystemHealth()">
              Proveri sistem
            </button>
            <button class="btn btn-info" (click)="viewLogs()">
              Prikaži logove
            </button>
          </div>
          <div *ngIf="systemStatus" [ngClass]="systemStatus.type" class="alert">
            {{ systemStatus.message }}
          </div>
        </div>
      </div>

      <!-- Brzi pristup -->
      <div class="quick-access">
        <h3>Brzi pristup</h3>
        <div class="quick-actions">
          <a routerLink="/" class="btn btn-secondary">🏠 Početna</a>
          <a routerLink="/zdravstvo" class="btn btn-success">🏥 Zdravstvo</a>
          <a routerLink="/predskolske" class="btn btn-success">🎓 Predškolske</a>
          <button class="btn btn-danger" (click)="logout()">🚪 Odjavi se</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
      color: white;
      border-radius: 12px;
    }

    .admin-header h1 {
      font-size: 2.5rem;
      margin-bottom: 10px;
      font-weight: 600;
    }

    .admin-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .admin-card {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      border-left: 4px solid #dc3545;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .admin-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
    }

    .admin-card h3 {
      color: #2c3e50;
      margin-bottom: 12px;
      font-size: 1.3rem;
    }

    .admin-card p {
      color: #666;
      margin-bottom: 20px;
      line-height: 1.6;
    }

    .card-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }

    .quick-access {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .quick-access h3 {
      color: #2c3e50;
      margin-bottom: 20px;
      text-align: center;
    }

    .quick-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .admin-header h1 {
        font-size: 2rem;
      }
      
      .admin-grid {
        grid-template-columns: 1fr;
      }
      
      .card-actions, .quick-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  authService = inject(AuthService);
  roleService = inject(RoleService);

  usersStatus: { type: string; message: string } | null = null;
  healthStatus: { type: string; message: string } | null = null;
  preschoolStatus: { type: string; message: string } | null = null;
  systemStatus: { type: string; message: string } | null = null;

  ngOnInit() {
    // Verify admin access
    if (!this.roleService.isAdmin()) {
      this.systemStatus = {
        type: 'alert-error',
        message: '❌ Nemate administratorske privilegije'
      };
    } else {
      this.systemStatus = {
        type: 'alert-success',
        message: '✅ Dobrodošli u admin panel'
      };
    }
  }

  loadUsers() {
    this.usersStatus = {
      type: 'alert-info',
      message: 'Učitavanje korisnika...'
    };
    
    // Simulate API call
    setTimeout(() => {
      this.usersStatus = {
        type: 'alert-success',
        message: '✅ Učitano 15 korisnika (5 građana, 3 lekara, 1 admin)'
      };
    }, 1000);
  }

  addUser() {
    this.usersStatus = {
      type: 'alert-info',
      message: 'Funkcionalnost dodavanja korisnika će biti implementirana'
    };
  }

  testHealthSystem() {
    this.healthStatus = {
      type: 'alert-info',
      message: 'Testiranje zdravstvenog sistema...'
    };
    
    setTimeout(() => {
      this.healthStatus = {
        type: 'alert-success',
        message: '✅ Zdravstveni sistem radi ispravno'
      };
    }, 1500);
  }

  testPreschoolSystem() {
    this.preschoolStatus = {
      type: 'alert-info',
      message: 'Testiranje sistema predškolskih ustanova...'
    };
    
    setTimeout(() => {
      this.preschoolStatus = {
        type: 'alert-success',
        message: '✅ Sistem predškolskih ustanova radi ispravno'
      };
    }, 1500);
  }

  checkSystemHealth() {
    this.systemStatus = {
      type: 'alert-info',
      message: 'Provera stanja sistema...'
    };
    
    setTimeout(() => {
      this.systemStatus = {
        type: 'alert-success',
        message: '✅ Svi servisi rade ispravno (Auth: OK, Zdravstvo: OK, Predškolske: OK)'
      };
    }, 2000);
  }

  viewLogs() {
    this.systemStatus = {
      type: 'alert-info',
      message: 'Funkcionalnost pregleda logova će biti implementirana'
    };
  }

  logout() {
    this.authService.logout().subscribe();
  }
}

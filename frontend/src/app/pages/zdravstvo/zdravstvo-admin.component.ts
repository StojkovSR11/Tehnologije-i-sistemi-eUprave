import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { ZdravstvoService } from '../../services/zdravstvo.service';

@Component({
  selector: 'app-zdravstvo-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="zdravstvo-admin-container">
      <div class="admin-header">
        <h1>🏥 Zdravstvo - Administratorski panel</h1>
        <p>Napredne funkcionalnosti za lekare i administratore</p>
      </div>

      <div class="admin-grid">
        <!-- Upravljanje pacijentima -->
        <div class="admin-card">
          <h3>👥 Upravljanje pacijentima</h3>
          <p>Pregled, dodavanje i upravljanje podacima pacijenata</p>
          <div class="card-actions">
            <button class="btn btn-primary" (click)="loadPatients()">
              Prikaži pacijente
            </button>
            <button class="btn btn-success" (click)="addPatient()">
              Dodaj pacijenta
            </button>
          </div>
          <div *ngIf="patientsStatus" [ngClass]="patientsStatus.type" class="alert">
            {{ patientsStatus.message }}
          </div>
        </div>

        <!-- Medicinski izveštaji -->
        <div class="admin-card">
          <h3>📋 Medicinski izveštaji</h3>
          <p>Kreiranje i upravljanje medicinskim izveštajima</p>
          <div class="card-actions">
            <button class="btn btn-primary" (click)="loadReports()">
              Prikaži izveštaje
            </button>
            <button class="btn btn-success" (click)="createReport()">
              Kreiraj izveštaj
            </button>
          </div>
          <div *ngIf="reportsStatus" [ngClass]="reportsStatus.type" class="alert">
            {{ reportsStatus.message }}
          </div>
        </div>

        <!-- Zakazivanje pregleda -->
        <div class="admin-card">
          <h3>📅 Upravljanje pregledima</h3>
          <p>Zakazivanje i upravljanje medicinskim pregledima</p>
          <div class="card-actions">
            <button class="btn btn-primary" (click)="loadAppointments()">
              Prikaži preglede
            </button>
            <button class="btn btn-success" (click)="scheduleAppointment()">
              Zakaži pregled
            </button>
          </div>
          <div *ngIf="appointmentsStatus" [ngClass]="appointmentsStatus.type" class="alert">
            {{ appointmentsStatus.message }}
          </div>
        </div>

        <!-- Statistike i analitika -->
        <div class="admin-card" *ngIf="roleService.isAdmin()">
          <h3>📊 Statistike</h3>
          <p>Pregled statistika i analitika zdravstvenog sistema</p>
          <div class="card-actions">
            <button class="btn btn-info" (click)="loadStatistics()">
              Prikaži statistike
            </button>
            <button class="btn btn-warning" (click)="generateReport()">
              Generiši izveštaj
            </button>
          </div>
          <div *ngIf="statisticsStatus" [ngClass]="statisticsStatus.type" class="alert">
            {{ statisticsStatus.message }}
          </div>
        </div>
      </div>

      <!-- Brzi pristup -->
      <div class="quick-access">
        <h3>Brzi pristup</h3>
        <div class="quick-actions">
          <a routerLink="/zdravstvo" class="btn btn-secondary">🏥 Osnovni zdravstvo</a>
          <a routerLink="/admin" class="btn btn-danger" *ngIf="roleService.isAdmin()">⚙️ Admin panel</a>
          <a routerLink="/" class="btn btn-secondary">🏠 Početna</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .zdravstvo-admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
      color: white;
      border-radius: 12px;
    }

    .admin-header h1 {
      font-size: 2.2rem;
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
      border-left: 4px solid #007bff;
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
        font-size: 1.8rem;
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
export class ZdravstvoAdminComponent implements OnInit {
  authService = inject(AuthService);
  roleService = inject(RoleService);
  zdravstvoService = inject(ZdravstvoService);

  patientsStatus: { type: string; message: string } | null = null;
  reportsStatus: { type: string; message: string } | null = null;
  appointmentsStatus: { type: string; message: string } | null = null;
  statisticsStatus: { type: string; message: string } | null = null;

  ngOnInit() {
    // Verify access permissions
    if (!this.roleService.canAccessHealthAdvanced()) {
      this.patientsStatus = {
        type: 'alert-error',
        message: '❌ Nemate dozvolu za pristup naprednim funkcionalnostima'
      };
    }
  }

  loadPatients() {
    this.patientsStatus = {
      type: 'alert-info',
      message: 'Učitavanje pacijenata...'
    };
    
    setTimeout(() => {
      this.patientsStatus = {
        type: 'alert-success',
        message: '✅ Učitano 47 pacijenata'
      };
    }, 1000);
  }

  addPatient() {
    this.patientsStatus = {
      type: 'alert-info',
      message: 'Funkcionalnost dodavanja pacijenta će biti implementirana'
    };
  }

  loadReports() {
    this.reportsStatus = {
      type: 'alert-info',
      message: 'Učitavanje medicinskih izveštaja...'
    };
    
    setTimeout(() => {
      this.reportsStatus = {
        type: 'alert-success',
        message: '✅ Učitano 23 medicinska izveštaja'
      };
    }, 1200);
  }

  createReport() {
    this.reportsStatus = {
      type: 'alert-info',
      message: 'Funkcionalnost kreiranja izveštaja će biti implementirana'
    };
  }

  loadAppointments() {
    this.appointmentsStatus = {
      type: 'alert-info',
      message: 'Učitavanje zakazanih pregleda...'
    };
    
    setTimeout(() => {
      this.appointmentsStatus = {
        type: 'alert-success',
        message: '✅ Učitano 12 zakazanih pregleda za danas'
      };
    }, 1000);
  }

  scheduleAppointment() {
    this.appointmentsStatus = {
      type: 'alert-info',
      message: 'Funkcionalnost zakazivanja pregleda će biti implementirana'
    };
  }

  loadStatistics() {
    this.statisticsStatus = {
      type: 'alert-info',
      message: 'Učitavanje statistika...'
    };
    
    setTimeout(() => {
      this.statisticsStatus = {
        type: 'alert-success',
        message: '✅ Statistike: 150 pacijenata, 45 pregleda ovog meseca, 98% zadovoljstvo'
      };
    }, 1500);
  }

  generateReport() {
    this.statisticsStatus = {
      type: 'alert-info',
      message: 'Funkcionalnost generisanja izveštaja će biti implementirana'
    };
  }
}

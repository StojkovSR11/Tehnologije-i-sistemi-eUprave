import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { RoleService } from '../../services/role.service';
import { PredskolskeService } from '../../services/predskolske.service';

import { Router } from '@angular/router';


@Component({
  selector: 'app-predskolske-admin',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="predskolske-admin-container">
      <div class="admin-header">
        <h1>🎓 Predškolske ustanove - Administratorski panel</h1>
        <p>Upravljanje vrtićima, decom i zahtevima za upis</p>
      </div>

      <div class="admin-grid">
        <!-- Upravljanje vrtićima -->
        <div class="admin-card">
          <h3>🏫 Upravljanje vrtićima</h3>
          <p>Dodavanje, uređivanje i upravljanje vrtićima u sistemu</p>
          <div class="card-actions">
            <button class="btn btn-primary" (click)="loadVrtici()">
              Prikaži vrtići
            </button>
            <button class="btn btn-success" (click)="addVrtic()">
              Dodaj vrtić
            </button>
          </div>
          <div *ngIf="vrticiStatus" [ngClass]="vrticiStatus.type" class="alert">
            {{ vrticiStatus.message }}
          </div>
        </div>

       <!-- Upravljanje decom -->
<div class="admin-card">
  <h3>👶 Upravljanje decom</h3>
  <p>Pregled i upravljanje podacima o deci u sistemu</p>
  <div class="card-actions">
    <button class="btn btn-primary" (click)="prikaziDecu()">
  Prikaži decu
    </button>
    <!-- Dugme Dodaj dete uklonjeno -->
  </div>
  <div *ngIf="decaStatus" [ngClass]="decaStatus.type" class="alert">
    {{ decaStatus.message }}
  </div>
</div>

        <!-- Upravljanje zahtevima -->
        <div class="admin-card">
          <h3>📋 Upravljanje zahtevima</h3>
          <p>Pregled i odobravanje zahteva za upis u vrtić</p>
          <div class="card-actions">
            <button class="btn btn-primary" (click)="loadZahtevi()">
              Prikaži zahteve
            </button>
            <button class="btn btn-warning" (click)="processPendingRequests()">
              Obradi čekajuće
            </button>
          </div>
        </div>

        <!-- Statistike -->
        <div class="admin-card">
          <h3>📊 Statistike i izveštaji</h3>
          <p>Pregled statistika o upisu i kapacitetu vrtića</p>
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

      
    </div>
  `,
  styles: [`
    .predskolske-admin-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .admin-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 30px;
      background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
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
      border-left: 4px solid #28a745;
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

    @media (max-width: 768px) {
      .admin-header h1 {
        font-size: 1.8rem;
      }
      
      .admin-grid {
        grid-template-columns: 1fr;
      }
      
      .card-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PredskolskeAdminComponent implements OnInit {

  constructor(private router: Router,private route: ActivatedRoute) {}

  authService = inject(AuthService);
  roleService = inject(RoleService);
  predskolskeService = inject(PredskolskeService);

  vrticiStatus: { type: string; message: string } | null = null;
  decaStatus: { type: string; message: string } | null = null;
  zahteviStatus: { type: string; message: string } | null = null;
  statisticsStatus: { type: string; message: string } | null = null;

  ngOnInit() {
    // Verify admin access
    if (!this.roleService.canAccessPreschoolAdvanced()) {
      this.vrticiStatus = {
        type: 'alert-error',
        message: '❌ Nemate dozvolu za pristup administratorskim funkcionalnostima'
      };
    }
  }

  // Dugmad za vrtiće
loadVrtici() {
  this.router.navigate(['/predskolske/vrtici']);
}

addVrtic() {
  this.router.navigate(['/predskolske/dodaj-vrtic']);
}


  prikaziDecu() {
  this.router.navigate(['/predskolske/deca']);
}

  addDete() {
    this.decaStatus = {
      type: 'alert-info',
      message: 'Funkcionalnost dodavanja deteta će biti implementirana'
    };
  }

  loadZahtevi() {
    this.router.navigate(['/predskolske/admin/zahtevi']);
  }

  processPendingRequests() {
    this.router.navigate(['/predskolske/admin/zahtevi'], {
      queryParams: { status: 'NA_CEKANJU' }
    });
  }

  loadStatistics() {
    this.statisticsStatus = {
      type: 'alert-info',
      message: 'Učitavanje statistika...'
    };
    
    setTimeout(() => {
      this.statisticsStatus = {
        type: 'alert-success',
        message: '✅ Statistike: 85% popunjenost vrtića, 23 nova zahteva ovog meseca'
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

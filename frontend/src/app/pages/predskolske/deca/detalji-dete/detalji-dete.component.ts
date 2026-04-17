import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { PredskolskeService, Dete } from '../../../../services/predskolske.service';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-detalji-dete',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="detalji-wrap">
      <h2>Podaci o detetu</h2>
      <p class="hint">Pregled podataka o detetu.</p>

      <div *ngIf="loading" class="alert alert-info">Učitavanje...</div>
      <div *ngIf="!loading && error" class="alert alert-error">{{ error }}</div>

      <dl *ngIf="!loading && dete && !error" class="detalji-dl">
        <dt>Ime</dt><dd>{{ dete.ime }}</dd>
        <dt>Prezime</dt><dd>{{ dete.prezime }}</dd>
        <dt>JMBG</dt><dd>{{ dete.jmbg }}</dd>
        <dt>Datum rođenja</dt><dd>{{ dete.datumRodj }}</dd>
        <dt>Korisnik ID</dt><dd>{{ dete.korisnikId }}</dd>
        <ng-container *ngIf="auth.getCurrentUser()?.role === 'ADMIN'">
          <dt>Grupa ID</dt><dd>{{ dete.grupaID || '—' }}</dd>
        </ng-container>
      </dl>

      <div class="akcije">
        <button type="button" class="btn btn-secondary" (click)="nazad()">⬅ Nazad</button>
        <a
          *ngIf="auth.getCurrentUser()?.role === 'CITIZEN'"
          [routerLink]="['/predskolske/dodaj-dete', deteId]"
          class="btn btn-primary"
        >
          Izmeni podatke
        </a>
      </div>
    </div>
  `,
  styles: [`
    .detalji-wrap { max-width: 560px; margin: 0 auto; padding: 1.25rem; }
    .hint { color: #666; font-size: 0.9rem; margin-bottom: 1rem; }
    .detalji-dl {
      display: grid;
      grid-template-columns: 140px 1fr;
      gap: 0.5rem 1rem;
      margin: 1rem 0 1.5rem;
    }
    .detalji-dl dt { font-weight: 600; color: #2c3e50; }
    .detalji-dl dd { margin: 0; }
    .akcije { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
  `]
})
export class DetaljiDeteComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private predskolskeService = inject(PredskolskeService);
  auth = inject(AuthService);

  deteId = '';
  dete: Dete | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.deteId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.deteId) {
      this.loading = false;
      this.error = 'Nedostaje ID deteta.';
      return;
    }
    this.predskolskeService.getDeteById(this.deteId).subscribe({
      next: (d) => {
        this.dete = d;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.error = 'Nije moguće učitati podatke o detetu.';
      }
    });
  }

  nazad(): void {
    this.location.back();
  }
}

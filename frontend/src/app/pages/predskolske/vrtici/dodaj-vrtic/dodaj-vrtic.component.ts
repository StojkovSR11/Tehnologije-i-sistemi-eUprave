import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PredskolskeService, Vrtic } from '../../../../services/predskolske.service';
import { apiErrorMessage } from '../../../../utils/api-error-message';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {  OnInit } from '@angular/core';

@Component({
  selector: 'app-dodaj-vrtic',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink], 
  templateUrl: './dodaj-vrtic.component.html',
  styleUrls: ['./dodaj-vrtic.component.css']
})
export class DodajVrticComponent implements OnInit {
  noviVrtic: Vrtic = { id:'', naziv:'', kapacitet:0, brojSlobodnihMesta:0 };
  status: { type: string, message: string } | null = null;

  vrticId: string | null = null;

  constructor(
  private predskolskeService: PredskolskeService,
  private router: Router,
  private route: ActivatedRoute
) {}
  sacuvajVrtic() {

  if (this.vrticId) {
    // UPDATE
    this.status = { type: 'alert-info', message: 'Ažuriranje vrtića...' };

    this.predskolskeService.azurirajVrtic(this.vrticId, this.noviVrtic).subscribe({
      next: () => {
        this.status = { type: 'alert-success', message: '✅ Vrtić ažuriran!' };
        setTimeout(() => this.router.navigate(['/predskolske/vrtici']), 1000);
      },
      error: (err) => {
        this.status = {
          type: 'alert-error',
          message: `❌ ${apiErrorMessage(err, 'Greška pri ažuriranju vrtića.')}`,
        };
      }
    });

  } else {
    // CREATE
    this.status = { type: 'alert-info', message: 'Dodavanje vrtića...' };
    this.noviVrtic.brojSlobodnihMesta = this.noviVrtic.kapacitet;

    this.predskolskeService.dodajVrtic(this.noviVrtic).subscribe({
      next: () => {
        this.status = { type: 'alert-success', message: '✅ Vrtić dodat!' };
        setTimeout(() => this.router.navigate(['/predskolske/vrtici']), 1000);
      },
      error: (err) => {
        this.status = {
          type: 'alert-error',
          message: `❌ ${apiErrorMessage(err, 'Greška pri dodavanju vrtića.')}`,
        };
      }
    });
  }
}

  odustani() {
    this.router.navigate(['/predskolske/vrtici']);
  }

  ngOnInit(): void {
  this.vrticId = this.route.snapshot.paramMap.get('id');

  if (this.vrticId) {
    // EDIT MODE
    this.predskolskeService.getVrtici().subscribe({
      next: (data) => {
        const vrtic = data.find(v => v.id === this.vrticId);
        if (vrtic) {
          this.noviVrtic = vrtic;
        }
      },
      error: (err) => {
        this.status = {
          type: 'alert-error',
          message: `❌ ${apiErrorMessage(err, 'Greška pri učitavanju vrtića.')}`,
        };
      }
    });
  }
}

}
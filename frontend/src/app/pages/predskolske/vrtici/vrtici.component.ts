import { Component, OnInit, inject } from '@angular/core';
import { PredskolskeService, Vrtic } from '../../../services/predskolske.service';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { apiErrorMessage } from '../../../utils/api-error-message';

@Component({
  selector: 'app-vrtici',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './vrtici.component.html',
  styleUrls: ['./vrtici.component.css']
})
export class VrticiComponent implements OnInit {

  vrtici: Vrtic[] = [];
  statusMessage: string = '';
  statusClass: string = '';

  private roleService = inject(RoleService);
  private location = inject(Location);

  constructor(
    private predskolskeService: PredskolskeService,
    private router: Router
  ) {}

  get jeAdmin(): boolean {
    return this.roleService.canAccessPreschoolAdvanced();
  }

  ngOnInit(): void {
    this.ucitajVrtice();
  }

  ucitajVrtice(): void {
  this.predskolskeService.getVrtici().subscribe({
    next: (data) => {
      // dodaj privremeno brojUpisanihDece = 0
      this.vrtici = data.map(v => ({ ...v, brojUpisanihDece: 0 }));
    },
    error: (err) =>
      this.prikaziStatus(apiErrorMessage(err, 'Greška pri učitavanju vrtića.'), 'alert-error')
  });
}

  // Privremeno: brojUpisanihDece još ne postoji, koristimo brojSlobodnihMesta
  getBrojSlobodnihMesta(vrtic: Vrtic): number {
    return vrtic.brojSlobodnihMesta; // privremeno, kasnije: vrtic.kapacitet - vrtic.brojUpisanihDece
  }

  urediVrtic(vrtic: Vrtic) {
    // Navigacija na stranicu za dodavanje/uređivanje sa ID-jem
    this.router.navigate(['/predskolske/dodaj-vrtic', vrtic.id]);
  }

  obrisiVrtic(vrtic: Vrtic) {
    // Privremeno: ne proveravamo broj dece, kasnije dodati stvarnu proveru
    if (confirm(`Da li ste sigurni da želite da obrišete vrtić "${vrtic.naziv}"?`)) {
      this.predskolskeService.obrisiVrtic(vrtic.id).subscribe({
        next: () => {
          this.vrtici = this.vrtici.filter(v => v.id !== vrtic.id);
          this.prikaziStatus('✅ Vrtić obrisan.', 'alert-success');
        },
        error: (err) =>
          this.prikaziStatus(apiErrorMessage(err, 'Greška pri brisanju vrtića.'), 'alert-error')
      });
    }
  }

  nazad() {
    if (this.jeAdmin) {
      this.router.navigate(['/predskolske/admin']);
    } else {
      this.location.back();
    }
  }

  prikaziStatus(message: string, type: string) {
    this.statusMessage = message;
    this.statusClass = type;

    setTimeout(() => {
      this.statusMessage = '';
      this.statusClass = '';
    }, 3000);
  }
}
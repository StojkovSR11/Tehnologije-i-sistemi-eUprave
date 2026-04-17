import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PredskolskeService, Dete } from '../../../../services/predskolske.service';
import { AuthService } from '../../../../services/auth.service';  // <--- dodato

@Component({
  selector: 'app-dodaj-dete',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dodaj-dete.component.html',
  styleUrls: ['./dodaj-dete.component.css']
})
export class DodajDeteComponent {
  novoDete: Dete = {
    jmbg: '',
    ime: '',
    prezime: '',
    datumRodj: '',
    korisnikId: ''  // automatski iz AuthService
  };

  status: { type: string, message: string } | null = null;

  constructor(
  private predskolskeService: PredskolskeService,
  private authService: AuthService,
  private router: Router,
  private location: Location
) {
  const userId = this.authService.getCurrentUserId();
  console.log("USER ID:", userId);

  this.novoDete.korisnikId = userId;
}

  sacuvajDete() {
  this.status = { type: 'alert-info', message: 'Dodavanje deteta...' };

  const payload = {
    jmbg: this.novoDete.jmbg,
    ime: this.novoDete.ime,
    prezime: this.novoDete.prezime,
    datumRodj: new Date(this.novoDete.datumRodj).toISOString(),
    korisnikId: this.novoDete.korisnikId
  };

  console.log("SALJEM:", payload);

  this.predskolskeService.dodajDete(payload).subscribe({
    next: () => {
      this.status = { type: 'alert-success', message: '✅ Dete je dodato!' };
      setTimeout(() => this.router.navigate(['/predskolske/moje-dete']), 1000);
    },
    error: (err) => {
      console.log("GRESKA:", err);
      this.status = { type: 'alert-error', message: '❌ Greška pri dodavanju deteta' };
    }
  });
}

  odustani() {
    this.location.back();
  }
}
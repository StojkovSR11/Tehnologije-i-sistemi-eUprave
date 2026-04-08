import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { PredskolskeService, Dete } from '../../../../services/predskolske.service';

@Component({
  selector: 'app-dodaj-dete',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './dodaj-dete.component.html',
  styleUrls: ['./dodaj-dete.component.css']
})
export class DodajDeteComponent {
  novoDete: Dete = {
    id: '',
    jmbg: '',
    ime: '',
    prezime: '',
    datumRodj: '',
    korisnikId: '',
    grupaID: ''
  };

  status: { type: string, message: string } | null = null;

  constructor(private predskolskeService: PredskolskeService, private router: Router) {}

  sacuvajDete() {
    this.status = { type: 'alert-info', message: 'Dodavanje deteta...' };

    this.predskolskeService.dodajDete(this.novoDete).subscribe({
      next: () => {
        this.status = { type: 'alert-success', message: '✅ Dete je dodato!' };
        setTimeout(() => this.router.navigate(['/predskolske/deca']), 1000);
      },
      error: () => {
        this.status = { type: 'alert-error', message: '❌ Greška pri dodavanju deteta' };
      }
    });
  }

  odustani() {
    this.router.navigate(['/predskolske/deca']);
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { PredskolskeService, Dete } from '../../../../services/predskolske.service';
import { AuthService } from '../../../../services/auth.service';
import { apiErrorMessage } from '../../../../utils/api-error-message';

@Component({
  selector: 'app-moje-dete',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './moje-dete.component.html',
  styleUrls: ['./moje-dete.component.css']
})
export class MojeDeteComponent implements OnInit {

  deca: Dete[] = [];
  statusMessage: string | null = null;

  private predskolskeService = inject(PredskolskeService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
  const korisnikId = this.authService.getCurrentUserId();
  console.log("Trenutni korisnik ID iz tokena:", korisnikId); // ovo dodaj
  this.loadMojeDece();
}

  loadMojeDece() {
  const korisnikId = this.authService.getCurrentUserId();
  console.log("Trenutni korisnik ID:", korisnikId);

  this.predskolskeService.getMojaDeca().subscribe({
    next: (data: Dete[]) => {
      console.log("Podaci o deci sa servera:", data);

      this.deca = data.filter(d => String(d.korisnikId) === String(korisnikId));

      console.log("Filtrirana deca:", this.deca);

      if (this.deca.length === 0) {
        this.statusMessage = 'Nemate registrovanu decu.';
      } else {
        this.statusMessage = null; // uklonimo poruku ako ima dece
      }
    },
    error: (err) => {
      console.error(err);
      this.statusMessage = apiErrorMessage(err, 'Greška pri učitavanju podataka o deci.');
    }
  });
}

  pregled(deteId: string) {
    this.router.navigate(['/predskolske/detalji-dete', deteId]);
  }

  izmeni(deteId: string) {
    this.router.navigate(['/predskolske/dodaj-dete', deteId]);
  }

  obrisi(deteId: string) {
    if (confirm('Da li ste sigurni da želite da obrišete dete?')) {
      this.predskolskeService.obrisiDete(deteId).subscribe({
        next: () => {
          this.statusMessage = 'Dete uspešno obrisano.';
          this.loadMojeDece();
        },
        error: (err) => {
          console.error(err);
          this.statusMessage = apiErrorMessage(err, 'Greška pri brisanju deteta.');
        }
      });
    }
  }
}
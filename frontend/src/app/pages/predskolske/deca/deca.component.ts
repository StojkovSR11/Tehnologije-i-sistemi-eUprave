import { Component, OnInit } from '@angular/core';
import { PredskolskeService, Dete } from '../../../services/predskolske.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-deca',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './deca.component.html',
  styleUrls: ['./deca.component.css']
})
export class DecaComponent implements OnInit {

  deca: Dete[] = [];
  statusMessage: string = '';
  statusClass: string = '';

  constructor(
    private predskolskeService: PredskolskeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.ucitajDecu();
  }

  ucitajDecu(): void {
    this.predskolskeService.getDeca().subscribe({
      next: (data) => this.deca = data,
      error: () => this.prikaziStatus('Greska pri ucitavanju dece', 'alert-error')
    });
  }

  urediDete(dete: Dete) {
    this.router.navigate(['/predskolske/dodaj-dete', dete.id]);
  }

  obrisiDete(dete: Dete) {
    if (confirm(`Da li ste sigurni da želite da obrišete dete "${dete.ime} ${dete.prezime}"?`)) {
      this.predskolskeService.getDeca().subscribe({
        next: () => {
          this.predskolskeService.obrisiZahtev(dete.id || '').subscribe({}); // ili endpoint za brisanje deteta
          this.deca = this.deca.filter(d => d.id !== dete.id);
          this.prikaziStatus('✅ Dete obrisano.', 'alert-success');
        },
        error: () => this.prikaziStatus('❌ Greska pri brisanju deteta', 'alert-error')
      });
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
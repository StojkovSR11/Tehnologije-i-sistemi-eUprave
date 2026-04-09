import { Component, OnInit } from '@angular/core';
import { PredskolskeService, Dete } from '../../../services/predskolske.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-deca',
  standalone: true,
  imports: [CommonModule, RouterModule],
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

  // Za admina: dugme Detalji vodi ka detaljima deteta
  prikaziDetalje(dete: Dete) {
    if (!dete.id) return;
    this.router.navigate(['/predskolske/detalji-dete', dete.id]);
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
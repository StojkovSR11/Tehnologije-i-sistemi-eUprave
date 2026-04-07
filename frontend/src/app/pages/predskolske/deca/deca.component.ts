import { Component, OnInit } from '@angular/core';
import { PredskolskeService, Dete } from '../../../services/predskolske.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-deca',
    standalone: true,
    imports: [CommonModule, FormsModule,RouterLink], 
  templateUrl: './deca.component.html',
  styleUrls: ['./deca.component.css']
})
export class DecaComponent implements OnInit {
  deca: Dete[] = [];
  novoDete: Dete = {
    jmbg: '',
    ime: '',
    prezime: '',
    datumRodj: '',
    korisnikId: ''
  };

  constructor(private predskolskeService: PredskolskeService) {}

  ngOnInit(): void {
    this.ucitajDecu();
  }

  ucitajDecu(): void {
    this.predskolskeService.getDeca().subscribe({
      next: (data) => this.deca = data,
      error: (err) => console.error('Greska pri ucitavanju dece', err)
    });
  }

  dodajDete(): void {
    this.predskolskeService.dodajDete(this.novoDete).subscribe({
      next: (det) => {
        this.deca.push(det);
        this.novoDete = { jmbg: '', ime: '', prezime: '', datumRodj: '', korisnikId: '' };
      },
      error: (err) => console.error('Greska pri dodavanju deteta', err)
    });
  }
}

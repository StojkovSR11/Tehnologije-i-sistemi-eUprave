import { Component, OnInit } from '@angular/core';
import { PredskolskeService, Grupa, Dete } from '../../../services/predskolske.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-grupe',
  templateUrl: './grupa.component.html',
  styleUrls: ['./grupa.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true,
})
export class GrupeComponent implements OnInit {

  grupe: Grupa[] = [];
  novaGrupa: Grupa = {
    naziv: '',
    vrticID: '',
    kapacitet: 0
  };

  deca: Dete[] = []; // da mozemo dodavati dete u grupu
  poruka: string = ''; // prikaz poruka uspeha/greske

  constructor(private predskolskeService: PredskolskeService) {}

  ngOnInit(): void {
    this.ucitajDecu(); // da imamo listu dece
    // Ovde mozes pozvati ucitajGrupe za neki default vrticID ako ga imas
  }

  // 🔹 UCITAJ DECU
  ucitajDecu(): void {
    this.predskolskeService.getDeca().subscribe({
      next: (data) => this.deca = data,
      error: (err) => console.error('Greska pri ucitavanju dece', err)
    });
  }

  // 🔹 UCITAJ GRUPE ZA VRTIC
  ucitajGrupe(vrticID: string): void {
    this.predskolskeService.getGrupe(vrticID).subscribe({
      next: (data) => this.grupe = data,
      error: (err) => console.error('Greska pri ucitavanju grupa', err)
    });
  }

  // 🔹 DODAJ GRUPU
  dodajGrupu(): void {
  this.predskolskeService.dodajGrupu(this.novaGrupa).subscribe({
    next: (g) => {
      this.grupe.push(g);
      this.novaGrupa = { naziv: '', vrticID: '', kapacitet: 0 };
      this.poruka = 'Grupa je uspesno dodata!';
    },
    error: (err) => {
      console.error('Greska pri dodavanju grupe', err);
      this.poruka = 'Greska pri dodavanju grupe!';
    }
  });
}

  // 🔹 DODAJ DETE U GRUPU
  dodajDete(grupaID: string): void {
    // Ovde biras dete iz liste - za sad uzimam prvo dete iz liste
    if (this.deca.length === 0) {
      this.poruka = 'Nema dece za dodati!';
      return;
    }

    const deteID = this.deca[0].id!; // za test uzimamo prvo dete

    this.predskolskeService.dodajDeteUGrupu(deteID, grupaID).subscribe({
      next: () => {
        this.poruka = 'Dete uspesno dodato u grupu!';
        // opcionalno, mozemo update liste dece u grupi
        const grupa = this.grupe.find(g => g.id === grupaID);
        if (grupa) {
          if (!grupa.listaDece) grupa.listaDece = [];
          grupa.listaDece.push(deteID);
        }
      },
      error: (err) => {
        console.error('Greska pri dodavanju deteta u grupu', err);
        this.poruka = 'Greska pri dodavanju deteta u grupu!';
      }
    });
  }
}
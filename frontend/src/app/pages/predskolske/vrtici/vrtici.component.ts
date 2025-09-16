import { Component, OnInit } from '@angular/core';
import { PredskolskeService, Vrtic } from '../../../services/predskolske.service';

@Component({
  selector: 'app-vrtici',
  templateUrl: './vrtici.component.html',
  styleUrls: ['./vrtici.component.css']
})
export class VrticiComponent implements OnInit {

  vrtici: Vrtic[] = [];
  noviVrtic: Vrtic = {
    id: "",
    naziv: '',
    kapacitet: 0,
    brojSlobodnihMesta: 0
  };

  constructor(private predskolskeService: PredskolskeService) {}

  ngOnInit(): void {
    this.ucitajVrtice();
  }

  ucitajVrtice(): void {
    this.predskolskeService.getVrtici().subscribe({
      next: (data) => this.vrtici = data,
      error: (err) => console.error('Greska pri ucitavanju vrtica', err)
    });
  }

  dodajVrtic(): void {
    this.predskolskeService.dodajVrtic(this.noviVrtic).subscribe({
      next: (vrt) => {
        this.vrtici.push(vrt);
        this.noviVrtic = { id:'' ,naziv: '', kapacitet: 0, brojSlobodnihMesta: 0 };
      },
      error: (err) => console.error('Greska pri dodavanju vrtica', err)
    });
  }

}

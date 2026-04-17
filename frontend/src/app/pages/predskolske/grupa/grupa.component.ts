import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PredskolskeService, Grupa, Dete, Vrtic, ZahtevZaUpis } from '../../../services/predskolske.service';

@Component({
  selector: 'app-grupe',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './grupa.component.html',
  styleUrls: ['./grupa.component.css'],
})
export class GrupeComponent implements OnInit {
  vrtici: Vrtic[] = [];
  izabraniVrticID = '';

  grupe: Grupa[] = [];
  svaDeca: Dete[] = [];
  sviZahtevi: ZahtevZaUpis[] = [];
  raspolozivaDeca: Dete[] = [];

  novaGrupa: Grupa = {
    naziv: '',
    vrticID: '',
    kapacitet: 1,
  };

  selektovanaDecaPoGrupi: Record<string, string> = {};
  poruka = '';
  tipPoruke: 'success' | 'error' = 'success';

  constructor(private predskolskeService: PredskolskeService) {}

  ngOnInit(): void {
    this.ucitajVrtice();
    this.ucitajDecu();
    this.ucitajZahteve();
  }

  ucitajVrtice(): void {
    this.predskolskeService.getVrtici().subscribe({
      next: (data) => {
        this.vrtici = data;
      },
      error: () => this.postaviPoruku('Greška pri učitavanju vrtića.', 'error'),
    });
  }

  ucitajDecu(): void {
    this.predskolskeService.getDeca().subscribe({
      next: (data) => {
        this.svaDeca = data;
        this.osveziRaspolozivuDecu();
      },
      error: () => this.postaviPoruku('Greška pri učitavanju dece.', 'error'),
    });
  }

  ucitajZahteve(): void {
    this.predskolskeService.getZahtevi().subscribe({
      next: (data) => {
        this.sviZahtevi = data;
        this.osveziRaspolozivuDecu();
      },
      error: () => this.postaviPoruku('Greška pri učitavanju zahteva.', 'error'),
    });
  }

  promeniVrtic(): void {
    this.novaGrupa.vrticID = this.izabraniVrticID;
    this.ucitajGrupe();
    this.osveziRaspolozivuDecu();
  }

  ucitajGrupe(): void {
    if (!this.izabraniVrticID) {
      this.grupe = [];
      return;
    }

    this.predskolskeService.getGrupe(this.izabraniVrticID).subscribe({
      next: (data) => {
        this.grupe = data;
      },
      error: () => this.postaviPoruku('Greška pri učitavanju grupa.', 'error'),
    });
  }

  dodajGrupu(): void {
    if (!this.novaGrupa.naziv.trim() || !this.izabraniVrticID || this.novaGrupa.kapacitet <= 0) {
      this.postaviPoruku('Unesite naziv grupe i validan kapacitet.', 'error');
      return;
    }

    this.novaGrupa.vrticID = this.izabraniVrticID;
    this.predskolskeService.dodajGrupu(this.novaGrupa).subscribe({
      next: () => {
        this.postaviPoruku('Grupa je uspešno dodata.', 'success');
        this.novaGrupa = { naziv: '', vrticID: this.izabraniVrticID, kapacitet: 1 };
        this.ucitajGrupe();
      },
      error: (err) =>
        this.postaviPoruku(err?.error?.error || 'Greška pri dodavanju grupe.', 'error'),
    });
  }

  obrisiGrupu(grupa: Grupa): void {
    if (!grupa.id) return;
    if ((grupa.listaDece?.length || 0) > 0) {
      this.postaviPoruku('Grupa sa raspoređenom decom ne može da se obriše.', 'error');
      return;
    }

    this.predskolskeService.obrisiGrupu(grupa.id).subscribe({
      next: () => {
        this.postaviPoruku('Grupa je obrisana.', 'success');
        this.ucitajGrupe();
      },
      error: (err) => this.postaviPoruku(err?.error?.error || 'Greška pri brisanju grupe.', 'error'),
    });
  }

  dodajDete(grupaID: string): void {
    const deteID = this.selektovanaDecaPoGrupi[grupaID];
    if (!deteID) {
      this.postaviPoruku('Izaberite dete za raspoređivanje.', 'error');
      return;
    }

    this.predskolskeService.dodajDeteUGrupu(deteID, grupaID).subscribe({
      next: () => {
        this.postaviPoruku('Dete je uspešno raspoređeno u grupu.', 'success');
        this.selektovanaDecaPoGrupi[grupaID] = '';
        this.ucitajDecu();
        this.ucitajGrupe();
      },
      error: (err) =>
        this.postaviPoruku(err?.error?.error || 'Greška pri raspoređivanju deteta.', 'error'),
    });
  }

  osveziRaspolozivuDecu(): void {
    if (!this.izabraniVrticID) {
      this.raspolozivaDeca = [];
      return;
    }

    const odobrenaDeca = new Set(
      this.sviZahtevi
        .filter((z) => z.status === 'ODOBREN' && z.vrticId === this.izabraniVrticID)
        .map((z) => z.deteId)
    );

    this.raspolozivaDeca = this.svaDeca.filter(
      (d) => d.id && odobrenaDeca.has(d.id) && !d.grupaID && d.vrticID === this.izabraniVrticID
    );
  }

  nazivDeteta(deteID: string): string {
    const dete = this.svaDeca.find((d) => d.id === deteID);
    return dete ? `${dete.ime} ${dete.prezime}` : deteID;
  }

  private postaviPoruku(tekst: string, tip: 'success' | 'error'): void {
    this.poruka = tekst;
    this.tipPoruke = tip;
  }
}

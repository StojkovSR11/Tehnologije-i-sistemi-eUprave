import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { PredskolskeService, ZahtevZaUpis, Dete, Vrtic } from "../../../services/predskolske.service";

@Component({
  selector: "app-zahtevi",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./zahtevi.component.html",
  styleUrls: ["./zahtevi.component.css"],
})
export class ZahteviComponent implements OnInit {
  private predskolskeService = inject(PredskolskeService);

  zahtevi: ZahtevZaUpis[] = [];
  deca: Dete[] = [];
  vrtici: Vrtic[] = [];

  noviZahtev: ZahtevZaUpis = {
 /* dete: {
    ime: "",
    prezime: "",
    jmbg: "",
    datumRodj: "",
    korisnikId: "",
  },*/

  deteId: "",
  vrticId: "",
  status: "NA_CEKANJU",
  datumZahteva: new Date().toISOString().split("T")[0],
};


  isLoading = false;
  statusMessage: { type: string; message: string } | null = null;

  ngOnInit() {
    this.loadZahtevi();
    this.loadDeca();
    this.loadVrtici();
  }

  loadZahtevi() {
    this.predskolskeService.getZahtevi().subscribe({
      next: (res) => (this.zahtevi = res),
      error: (err) =>
        (this.statusMessage = { type: "alert-error", message: `Greška: ${err.message}` }),
    });
  }

  loadDeca() {
    this.predskolskeService.getDeca().subscribe({
      next: (res) => (this.deca = res),
    });
  }

  loadVrtici() {
    this.predskolskeService.getVrtici().subscribe({
      next: (res) => (this.vrtici = res),
    });
  }

  dodajZahtev() {
    if (!this.noviZahtev.deteId || !this.noviZahtev.vrticId) return;

    this.isLoading = true;
    this.predskolskeService.dodajZahtev(this.noviZahtev).subscribe({
      next: (res) => {
        this.statusMessage = { type: "alert-success", message: "Zahtev dodat!" };
        this.noviZahtev.deteId = "";


        this.noviZahtev.vrticId = "";
        this.loadZahtevi();
        this.isLoading = false;
      },
      error: (err) => {
        this.statusMessage = { type: "alert-error", message: `Greška: ${err.message}` };
        this.isLoading = false;
      },
    });
  }

  obrisiZahtev(id: string) {
    this.predskolskeService.obrisiZahtev(id).subscribe({
      next: () => this.loadZahtevi(),
      error: (err) => console.error(err),
    });
  }


  //prva funkcionalnost - upisivanje deteta u vrtic

  // Dohvatanje imena deteta po ID-ju
getDeteIme(deteId: string) {
  const dete = this.deca.find(d => d.korisnikId === deteId);
  return dete ? `${dete.ime} ${dete.prezime}` : "Nepoznato dete";
}

// Dohvatanje naziva vrtića po ID-ju
getVrticNaziv(vrticId: string) {
  const vrtic = this.vrtici.find(v => v.id === vrticId);
  return vrtic ? vrtic.naziv : "Nepoznati vrtic";
}

// Odobravanje zahteva
odobriZahtev(zahtevId: string) {
  this.predskolskeService.odobriZahtev(zahtevId).subscribe({
    next: () => this.loadZahtevi(),
    error: (err) => console.error("Greška pri odobravanju:", err),
  });
}

// Odbijanje zahteva sa unosom napomene
odbijZahtevPrompt(zahtevId: string) {
  const napomena = prompt("Unesite razlog odbijanja:");
  if (!napomena) return;

  this.predskolskeService.odbijZahtev(zahtevId, napomena).subscribe({
    next: () => this.loadZahtevi(),
    error: (err) => console.error("Greška pri odbijanju:", err),
  });
}
}

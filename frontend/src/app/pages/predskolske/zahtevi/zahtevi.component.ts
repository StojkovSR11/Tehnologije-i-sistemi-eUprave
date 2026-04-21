import { Component, OnInit, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { PredskolskeService, ZahtevZaUpis, Dete, Vrtic } from "../../../services/predskolske.service";

@Component({
  selector: "app-zahtevi",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: "./zahtevi.component.html",
  styleUrls: ["./zahtevi.component.css"],
})
export class ZahteviComponent implements OnInit {
  private predskolskeService = inject(PredskolskeService);
  private route = inject(ActivatedRoute);

  zahtevi: ZahtevZaUpis[] = [];
  filtriraniZahtevi: ZahtevZaUpis[] = [];
  deca: Dete[] = [];
  vrtici: Vrtic[] = [];

  filterStatus = "SVI";
  isLoading = false;
  statusMessage: { type: string; message: string } | null = null;

  ngOnInit() {
    this.filterStatus = this.route.snapshot.queryParamMap.get("status") || "SVI";
    this.loadDeca();
    this.loadVrtici();
    this.loadZahtevi();
  }

  loadZahtevi() {
    this.isLoading = true;
    this.predskolskeService.getZahtevi().subscribe({
      next: (res) => {
        this.zahtevi = res;
        this.primeniFilter();
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.statusMessage = { type: "alert-error", message: `Greška: ${err.message}` };
      },
    });
  }

  loadDeca() {
    this.predskolskeService.getDeca().subscribe({
      next: (res) => {
        this.deca = res;
      },
    });
  }

  loadVrtici() {
    this.predskolskeService.getVrtici().subscribe({
      next: (res) => {
        this.vrtici = res;
      },
    });
  }

  primeniFilter() {
    if (this.filterStatus === "SVI") {
      this.filtriraniZahtevi = [...this.zahtevi];
      return;
    }
    this.filtriraniZahtevi = this.zahtevi.filter((z) => z.status === this.filterStatus);
  }

  getDeteIme(deteId: string) {
    const dete = this.deca.find((d) => d.id === deteId);
    return dete ? `${dete.ime} ${dete.prezime}` : "Nepoznato dete";
  }

  getVrticNaziv(vrticId: string) {
    const vrtic = this.vrtici.find((v) => v.id === vrticId);
    return vrtic ? vrtic.naziv : "Nepoznati vrtić";
  }

  odobriZahtev(zahtevId: string) {
    this.predskolskeService.odobriZahtev(zahtevId).subscribe({
      next: (res) => {
        if (res?.status === "ODBIJEN") {
          this.statusMessage = {
            type: "alert-error",
            message: `Zahtev nije odobren: ${res?.napomena || "zdravstveni uslovi nisu ispunjeni."}`,
          };
        } else {
          this.statusMessage = { type: "alert-success", message: "Zahtev je uspešno odobren." };
        }
        this.loadZahtevi();
        this.loadVrtici();
      },
      error: (err) => {
        this.statusMessage = { type: "alert-error", message: `Greška pri odobravanju: ${err.error?.error || err.message}` };
      },
    });
  }

  odbijZahtevPrompt(zahtevId: string) {
    const napomena = prompt("Unesite razlog odbijanja:");
    if (!napomena) return;

    this.predskolskeService.odbijZahtev(zahtevId, napomena).subscribe({
      next: () => {
        this.statusMessage = { type: "alert-success", message: "Zahtev je odbijen i razlog je sačuvan." };
        this.loadZahtevi();
      },
      error: (err) => {
        this.statusMessage = { type: "alert-error", message: `Greška pri odbijanju: ${err.error?.error || err.message}` };
      },
    });
  }
}

import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { PredskolskeService, Vrtic } from '../../../../services/predskolske.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dodaj-vrtic',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink], 
  templateUrl: './dodaj-vrtic.component.html',
  styleUrls: ['./dodaj-vrtic.component.css']
})
export class DodajVrticComponent {

  noviVrtic: Vrtic = { id:'', naziv:'', kapacitet:0, brojSlobodnihMesta:0 };

  constructor(private predskolskeService: PredskolskeService, private router: Router) {}

 dodajVrtic() {
  this.predskolskeService.dodajVrtic(this.noviVrtic).subscribe({
    next: () => {
      alert('✅ Vrtić je dodat!');
      this.router.navigate(['/predskolske/admin/vrtici']);
    },
    error: (err: any) => console.error('Greska pri dodavanju vrtica', err)
  });
}

}
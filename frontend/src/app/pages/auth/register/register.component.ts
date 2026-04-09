import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,   // ako vec jeste standalone
  imports: [FormsModule,CommonModule]
})
export class RegisterComponent {
  jmbg = '';
  email = '';
  ime = '';
  prezime = '';
  password = '';
  message = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister() {
    const registerData: RegisterRequest = {
      jmbg: this.jmbg,
      email: this.email,
      ime: this.ime,
      prezime: this.prezime,
      password: this.password
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        this.message = 'Uspešno ste registrovani!';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = 'Greška pri registraciji.';
      }
    });
  }
}

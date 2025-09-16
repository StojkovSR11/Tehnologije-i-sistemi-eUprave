import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,   // ako vec jeste standalone
  imports: [FormsModule,CommonModule]
})
export class LoginComponent {
  jmbg = '';
  password = '';
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    const credentials: LoginRequest = {
      jmbg: this.jmbg,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.router.navigate(['/dashboard']); // ili bilo koja zaštićena ruta
      },
      error: (err) => {
        this.errorMessage = 'Pogrešan JMBG ili lozinka';
      }
    });
  }
}

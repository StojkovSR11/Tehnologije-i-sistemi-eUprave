import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.http.post<any>('http://localhost:8082/api/v1/login', {
      jmbg: this.jmbg,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        this.router.navigate(['/dashboard']); // ili bilo koja zaštićena ruta
      },
      error: (err) => {
        this.errorMessage = 'Pogrešan JMBG ili lozinka';
      }
    });
  }
}

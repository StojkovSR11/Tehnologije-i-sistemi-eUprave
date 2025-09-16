import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,   // ako vec jeste standalone
  imports: [FormsModule]
})
export class RegisterComponent {
  jmbg = '';
  email = '';
  name = '';
  password = '';
  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  onRegister() {
    this.http.post<any>('http://localhost:8082/api/v1/register', {
      jmbg: this.jmbg,
      email: this.email,
      name: this.name,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.message = 'Uspešno ste registrovani!';
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.message = 'Greška pri registraciji.';
      }
    });
  }
}

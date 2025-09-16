import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="unauthorized-container">
      <div class="unauthorized-card">
        <div class="unauthorized-icon">🚫</div>
        <h1>Nemate dozvolu</h1>
        <p>Nemate potrebne dozvole za pristup ovoj stranici.</p>
        <a routerLink="/" class="btn btn-primary">Povratak na početnu</a>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .unauthorized-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
      padding: 40px;
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    .unauthorized-icon {
      font-size: 4rem;
      margin-bottom: 20px;
    }

    h1 {
      color: #2c3e50;
      margin-bottom: 16px;
      font-size: 1.8rem;
    }

    p {
      color: #666;
      margin-bottom: 30px;
      line-height: 1.6;
    }

    .btn {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 500;
      transition: transform 0.3s ease;
    }

    .btn:hover {
      transform: translateY(-2px);
    }
  `]
})
export class UnauthorizedComponent {}

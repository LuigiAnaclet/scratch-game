import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class HomeComponent {
  username: string = '';
  apiUrl: string = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit() {
  }

  // Connexion ou création de l'utilisateur
  startGame(): void {
    if (this.username.trim()) {
      this.http.post(`${this.apiUrl}/users`, { username: this.username }).subscribe(
        () => {
          localStorage.setItem('username', this.username);
          this.router.navigate(['/game']);
        },
        (error) => {
          console.error('Erreur lors de la connexion', error);
        }
      );
    }
  }
}

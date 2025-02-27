// game.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-game',
  standalone: true,
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class GameComponent {
  username: string = '';
  grid: string[] = []; // Initialiser la grille
  selected: number[] = []; // Cases sélectionnées
  result: string | null = null; // Résultat du jeu
  showPopup: boolean = false; // Affichage de la pop-up
  hiddenGifts: string[] = []; // Tableau contenant les cadeaux cachés sous les ballons
  apiUrl: string = environment.apiUrl;
  history: any[] = []; // Stocker les 3 dernières participations
  isRigged: boolean = false;
  attemptsLeft: number = 2;
  wonPrize: { name: string, image: string } | null = null;
  scratched: boolean[] = [];



  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {
    this.route.params.subscribe(() => {
      this.loadUsername();
      this.fetchLossStreak(); // Récupérer la série de défaites
      this.fetchDailyAttempts(); // Récupère les tentatives restantes au chargement
      //this.initializeGrid(); // Initialiser la grille avec des cadeaux
    });
  }

  // Charger le pseudo stocké en local
  loadUsername(): void {
    if (typeof window !== "undefined" && window.localStorage) {
        this.username = localStorage.getItem('username') || '';
    }

    if (!this.username) {
        this.router.navigate(['/']);
    }
}


  // Initialiser la grille avec 3 fois chaque couleur (9 cases)
  initializeGrid(): void {
    if (this.isRigged) {
        this.hiddenGifts = Array(9).fill('assets/images/diamond.png'); //Grille truquée avec un seul type de cadeau
    } else {
        const gifts = [
            'assets/images/diamond.png',
            'assets/images/liasse.png',
            'assets/images/gold.png'
        ];
        this.hiddenGifts = [];
        for (let i = 0; i < 3; i++) {
            this.hiddenGifts.push(...gifts);
        }
        this.hiddenGifts = this.shuffleArray(this.hiddenGifts);
    }
    this.grid = [
        'assets/images/num_1.png',
        'assets/images/num_2.png',
        'assets/images/num_3.png',
        'assets/images/num_4.png',
        'assets/images/num_5.png',
        'assets/images/num_6.png',
        'assets/images/num_7.png',
        'assets/images/num_8.png',
        'assets/images/num_9.png'
    ];
}


  // Mélanger un tableau (algorithme de Fisher-Yates)
  shuffleArray(array: string[]): string[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Gérer le clic sur une case
  handlePlay(index: number): void {
    if (this.attemptsLeft === 0 || this.selected.length >= 3 || this.selected.includes(index)) {
        return;
    }

    this.scratched[index] = true; 
    
    setTimeout(() => {
      this.selected.push(index);
  }, 500);


    setTimeout(() => {
      this.grid[index] = this.hiddenGifts[index];
      this.scratched[index] = false; 

      if (this.selected.length === 3) {
          setTimeout(() => this.checkWin(), 500); 
      }
  }, 500);
}


  checkWin(): void {
    if (this.selected.length !== 3) return;
    const revealed = this.selected.map(index => this.grid[index]);

    // Vérifier si les 3 cadeaux révélés sont identiques
    const win = new Set(revealed).size === 1;

    this.result = win ? 'Gagné' : 'Perdu';
    //console.log("Résultat :", this.result );
    if (this.result==='Gagné') {
      this.wonPrize = this.getRandomPrize();
      //console.log("Lot gagné :", this.wonPrize);
  } else {
      this.result = "Perdu";
      this.wonPrize = null;
  }
    this.showPopup = true; // Afficher la pop-up

    

    // Si la partie était truquée, réinitialiser `isRigged`
    if (this.isRigged) {
        this.isRigged = false;
    }

    // Sauvegarder la participation
    this.saveGame();

    // Charger l'historique des dernières participations
    this.fetchHistory();
}


  // Sauvegarder la participation dans la base de données
  saveGame(): void {
    this.http.post(`${this.apiUrl}/save`, {
        username: this.username,
        result: this.result,
        date: new Date().toISOString()
    }).subscribe(() => {
        this.fetchDailyAttempts(); //Met à jour les tentatives restantes après la sauvegarde
    });
}

  // Récupérer les 3 dernières participations
  fetchHistory(): void {
    this.http.get<any[]>(`${this.apiUrl}/history/${this.username}`).subscribe(
        (data) => {
            this.history = data.map(entry => ({
                result: entry.result,
                date: entry.formatted_date
            }));
        },
        (error) => {
            console.error("Erreur lors de la récupération de l'historique", error);
        }
    );
  }

  fetchLossStreak(): void {
    if (typeof window === "undefined") {
      return;
  }

  this.http.get<number>(`${this.apiUrl}/loss-streak/${this.username}`).subscribe(
      (streak) => {
          //console.log("Série de défaites :", streak);
          this.isRigged = streak === 9; //Si 9 défaites d'affilée, la grille sera truquée
          this.initializeGrid();
      },
      (error) => {
          console.error("Erreur lors de la récupération de la série de défaites", error);
      }
  );
}

  // Récupérer le nombre de parties jouées aujourd’hui
fetchDailyAttempts(): void {
  if (typeof window === "undefined") {
    return;
}
  this.http.get<{ attempts: number }>(`${this.apiUrl}/daily-count/${this.username}`).subscribe(
      (data) => {
        this.attemptsLeft = 3; //data.attempts;
        //console.log("Tentatives restantes :", this.attemptsLeft);
      },
      (error) => {
          console.error("Erreur lors de la récupération du nombre de tentatives", error);
      }
  );
}
// Fonction pour rejouer
replay(): void {
  if (this.attemptsLeft > 0) {
      this.selected = [];
      this.result = null;
      this.showPopup = false;
      this.fetchLossStreak();
      this.initializeGrid();
  }
}
  // Fermer la pop-up
  closePopup(): void {
    this.showPopup = false;
  }

  //Attribution d'un lot aléatoire
  getRandomPrize(): { name: string, image: string } {
    const prizes = [
        { name: "Voiture", image: "assets/images/car.png", chance: 5 },
        { name: "Billet d'avion", image: "assets/images/plane_ticket.png", chance: 10 },
        { name: "100€ de bons d'achats", image: "assets/images/gift_card.png", chance: 20 },
        { name: "Casque audio haut de gamme", image: "assets/images/headphones.png", chance: 15 },
        { name: "Smartphone", image: "assets/images/smartphone.png", chance: 10 },
        { name: "Abonnement salle de sport 6 mois", image: "assets/images/gym.png", chance: 15 },
        { name: "Dîner gastronomique", image: "assets/images/dinner.png", chance: 10 },
        { name: "Console de jeux", image: "assets/images/console.png", chance: 5 },
        { name: "Billets de cinéma pour un an", image: "assets/images/cinema.png", chance: 10 }
    ];

    // Création d'un tableau pondéré
    const weightedPool: { name: string, image: string }[] = [];

    prizes.forEach(prize => {
        for (let i = 0; i < prize.chance; i++) {
            weightedPool.push(prize);
        }
    });

    // Sélection totalement équitable parmi tous les éléments pondérés
    const randomIndex = Math.floor(Math.random() * weightedPool.length);
    return weightedPool[randomIndex];
}

}

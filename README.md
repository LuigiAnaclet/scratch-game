# 🎰 Scratch Game – Jeu de Grattage

Bienvenue dans **Scratch Game**, un mini-jeu de grattage en ligne où les utilisateurs peuvent gratter 3 cases pour tenter de gagner des récompenses !  
Ce projet fullstack repose sur **Node.js/Express** pour le backend, **PostgreSQL** pour la base de données, et un frontend HTML/CSS/JS léger.

---

## 🖼️ Aperçu

| Gagné 🎉 | Grattage 🎮 | Perdu ❌ |
|---------|-------------|----------|
| ![Gagné](./captures/gagne.png) | ![Jeu](./captures/jeu.png) | ![Perdu](./captures/perdu.png) |

---

## 📦 Fonctionnalités

- 🎯 Jeu de grattage simple (gratter 3 cases)
- 🧠 Historique des 3 dernières parties
- 🔁 Limitation des tentatives par joueur
- 🧾 Système de gains aléatoires
- 🗃️ Backend avec stockage en base PostgreSQL
- 🌐 Déploiement sur Render.com

---

## ⚙️ Technologies utilisées

- **Frontend** : HTML, CSS, JavaScript vanilla
- **Backend** : Node.js, Express.js
- **Base de données** : PostgreSQL (hébergée sur Render)
- **Déploiement** : Render.com (service web + DB PostgreSQL)

---

## 🛠️ Initialisation locale (si besoin)

1. Crée un fichier `.env` contenant :

```env
DB_HOST=xxxxx
DB_PORT=5432
DB_USER=xxxxx
DB_PASSWORD=xxxxx
DB_DATABASE=xxxxx
```

2. Lancer la route d'initialisation (une seule fois) pour créer les tables :

GET https://scratch-game.onrender.com/init-db

---

## 🌱 Tester en ligne

👉 Le jeu est disponible ici :  
[https://scratch-game.onrender.com](https://scratch-game-front.onrender.com/)

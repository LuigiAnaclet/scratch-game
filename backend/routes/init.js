const express = require('express');
const router = express.Router();
const pool = require('../database'); // adapte si le chemin est différent

router.get('/init-db', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS participations (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        result VARCHAR(20) DEFAULT 'En attente',
        date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    res.send("✅ Table 'participations' créée avec succès (ou déjà existante).");
  } catch (err) {
    console.error("Erreur lors de la création de la table :", err);
    res.status(500).send("Erreur lors de la création de la table.");
  }
});

module.exports = router;

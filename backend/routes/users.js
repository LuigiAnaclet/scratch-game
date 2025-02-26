const express = require('express');
const router = express.Router();
const pool = require('../database');;

// Route pour créer un utilisateur s'il n'existe pas
router.post("/api/users", async (req, res) => {
    const { username } = req.body;
  
    if (!username) {
      return res.status(400).json({ error: "Le pseudo est requis" });
    }
  
    try {
      // Vérifier si l'utilisateur existe déjà dans `participations`
      const userCheck = await pool.query(
        "SELECT DISTINCT username FROM participations WHERE username = $1",
        [username]
      );
  
      if (userCheck.rows.length === 0) {
        // Insérer une participation pour créer l'utilisateur
        await pool.query(
          "INSERT INTO participations (username, result) VALUES ($1, $2)",
            [username, "En attente"]
        );
      }
  
      res.json({ message: "Connexion réussie", username });
    } catch (err) {
      console.error("Erreur SQL :", err);
      res.status(500).json({ error: "Erreur lors de la connexion utilisateur", details: err.message });
    }
  });

  router.get("/api/users", async (req, res) => {
    try {
        const users = await pool.query("SELECT DISTINCT * FROM participations");
        res.json(users.rows);
    } catch (err) {
        console.error("Erreur SQL :", err);
        res.status(500).json({ error: "Erreur lors de la récupération des utilisateurs", details: err.message });
    }
});
module.exports = router;

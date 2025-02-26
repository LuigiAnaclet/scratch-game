const express = require('express');
const router = express.Router();
const pool = require('../database'); // Connexion PostgreSQL

//Route pour récupérer l’historique des 3 dernières parties d'un utilisateur spécifique avec formatage de date
router.get("/api/history/:username", async (req, res) => {
    const { username } = req.params;
    
    if (!username) {
        return res.status(400).json({ error: "Le pseudo est requis" });
    }

    try {
        const history = await pool.query(
            "SELECT result, TO_CHAR(date, 'DD/MM/YYYY') AS formatted_date FROM participations WHERE username = $1 AND result <> 'En attente' ORDER BY date DESC LIMIT 3",
            [username]
        );
        res.json(history.rows);
    } catch (err) {
        console.error("Erreur SQL :", err);
        res.status(500).json({ error: "Erreur lors de la récupération de l'historique", details: err.message });
    }
});

//Route pour sauvegarder une nouvelle partie
router.post("/api/save", async (req, res) => {
    const { username, result } = req.body;
    if (!username || !result) {
        return res.status(400).json({ error: "Le pseudo et le résultat sont requis" });
    }

    try {
        await pool.query(
            "INSERT INTO participations (username, result) VALUES ($1, $2)",
            [username, result]
        );
        res.json({ message: "Partie enregistrée avec succès" });
    } catch (err) {
        console.error("Erreur SQL :", err);
        res.status(500).json({ error: "Erreur lors de l'enregistrement de la partie", details: err.message });
    }
});

// Route pour vérifier si le joueur a perdu 9 fois d'affilée
router.get("/api/loss-streak/:username", async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Le pseudo est requis" });
    }

    try {
        const lossStreak = await pool.query(
            `WITH streak AS (
                SELECT result, 
                       date,
                       SUM(CASE WHEN result = 'Gagné' THEN 1 ELSE 0 END) OVER (ORDER BY date DESC) AS win_group
                FROM participations WHERE username = $1
            )
            SELECT COUNT(*) AS count FROM streak WHERE win_group = 0 AND result = 'Perdu'` ,
            [username]
        );
        
        res.json(parseInt(lossStreak.rows[0].count));
    } catch (err) {
        console.error("Erreur SQL :", err);
        res.status(500).json({ error: "Erreur lors de la vérification de la série de défaites", details: err.message });
    }
});

// Route pour vérifier le nombre de parties jouées aujourd'hui
router.get("/api/daily-count/:username", async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({ error: "Le pseudo est requis" });
    }

    try {
        const todayCount = await pool.query(
            `SELECT COUNT(*) AS count FROM participations 
             WHERE username = $1 
             AND date >= CURRENT_DATE`,
            [username]
        );

        res.json({ attempts: 3 - parseInt(todayCount.rows[0].count) }); // Renvoie les tentatives restantes
    } catch (err) {
        console.error("Erreur SQL :", err);
        res.status(500).json({ error: "Erreur lors de la récupération du nombre de parties jouées", details: err.message });
    }
});


module.exports = router;

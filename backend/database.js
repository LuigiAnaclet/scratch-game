const { Pool } = require('pg');

// Configuration de la connexion PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});


// Vérification de la connexion
pool.connect()
  .then(() => console.log("Connecté à PostgreSQL"))
  .catch(err => console.error("Erreur de connexion à PostgreSQL", err));

  module.exports = pool;
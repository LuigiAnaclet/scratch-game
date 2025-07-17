const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false // nécessaire pour Render
  }
});

pool.connect()
  .then(() => console.log("✅ Connecté à PostgreSQL avec SSL"))
  .catch(err => console.error("❌ Erreur de connexion à PostgreSQL", err));

module.exports = pool;

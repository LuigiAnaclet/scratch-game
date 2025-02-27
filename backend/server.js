const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
const port = 3600;
const users = require('./routes/users');
const history = require('./routes/history');
app.use(cors());
app.use(express.json());


// Route permettant de faire les requètes vers la bdd
app.use(users);
app.use(history);

app.listen(port, () => {
  console.log(`Serveur Express lancé`);
});

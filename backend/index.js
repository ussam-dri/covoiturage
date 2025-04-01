require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "covoi",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

// User Registration
app.post("/register", async (req, res) => {
  const { nom, prenom, email, password, ville, adresse, cin, num_telephone, date_naissance, sexe, age } = req.body;

  // Check if user already exists
  db.query("SELECT * FROM utilisateur WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error-in registering user to db" });
    if (results.length > 0) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const def_role="passenger"
    // Insert new user
    db.query(
      "INSERT INTO utilisateur (nom, prenom, email, password, ville, adresse, cin, num_telephone, date_naissance, sexe, age, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [nom, prenom, email, hashedPassword, ville, adresse, cin, num_telephone, date_naissance, sexe, age, def_role],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(201).json({ message: "User registered successfully" });
      }
    );
  });
});

// User Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  db.query("SELECT * FROM utilisateur WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(400).json({ message: "User not found" });

    const user = results[0];
    JWT_SECRET="aa_çuazdç_a_dzu%%k;xaàç_"
    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, role: user.role } });
  });
});

// Search for trips based on criteria
app.get("/search", (req, res) => {
  const { ville_depart, ville_arriver, date_depart, nbr_places } = req.query;

  let query = `SELECT * FROM trajet WHERE 1=1`;
  let params = [];

  if (ville_depart) {
    query += ` AND ville_depart LIKE ?`;
    params.push(`%${ville_depart}%`);
  }
  if (ville_arriver) {
    query += ` AND ville_arriver LIKE ?`;
    params.push(`%${ville_arriver}%`);
  }
  if (date_depart) {
    query += ` AND date_depart = ?`;
    params.push(date_depart);
  }
  if (nbr_places) {
    query += ` AND nbr_places >= ?`;
    params.push(parseInt(nbr_places));
  }

  db.query(query, params, (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error", details: err });
    } else {
      res.json(results);
    }
  });
});
//get all users

app.get("/users", (req, res) => {
  db.query("SELECT * FROM utilisateur", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error", details: err });
    } else {
      res.json(results);
    }
  });
});
// Autocomplete for cities
app.get("/autocomplete", (req, res) => {
  const { query } = req.query;

  if (!query) return res.json([]);

  const sql = `
    SELECT DISTINCT ville_depart AS city FROM trajet WHERE ville_depart LIKE ?
    UNION 
    SELECT DISTINCT ville_arriver AS city FROM trajet WHERE ville_arriver LIKE ?
    LIMIT 10;
  `;

  db.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error", details: err });
    } else {
      res.json(results.map((row) => row.city));
    }
  });
});

// Start server
const PORT = process.env.PORT || 5090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

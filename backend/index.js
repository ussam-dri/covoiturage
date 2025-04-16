require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; // Expected format: Bearer <token>
  const secret = process.env.JWT_SECRET || "aa_çuazdç_a_dzu%%k;xaàç_";

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });

    req.user = decoded; // decoded contains user.id and user.role
    next();
  });
}

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
  const { nom, prenom, email, password, ville, adresse, cin, num_telephone, date_naissance, sexe, age,role } = req.body;

  // Check if user already exists
  db.query("SELECT * FROM utilisateur WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ message: "Database error-in registering user to db" });
    if (results.length > 0) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const def_role=role||"passenger"
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
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "3h" });
    //console.log("Login token:", token);
    res.json({ message: "Login successful", token, user: { id: user.id, email: user.email, role: user.role,id:user.id,nom:user.nom,prenom:user.prenom,token:token,num_telephone:user.num_telephone,cin:user.cin,date_naissance:user.date_naissance,ville:user.ville,sexe:user.sexe } });
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
  //console.log(query)
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
// create a trip
app.post("/add-trip", (req, res) => {
  const sql_req = `INSERT INTO trajet 
    (date_depart, date_arrivee, heure_depart, heure_arrivee, ville_depart, ville_arriver, prix, nbr_places, fumer, animaux, musique, marque, matricule, id_driver) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const {
    date_depart,
    date_arrivee,
    heure_depart,
    heure_arrivee,
    ville_depart,
    ville_arriver,
    prix,
    nbr_places,
    fumer,
    animaux,
    musique,
    marque,
    matricule,
    id_driver
  } = req.body;

  db.query(
    sql_req,
    [date_depart, date_arrivee, heure_depart, heure_arrivee, ville_depart, ville_arriver, prix, nbr_places, fumer, animaux, musique, marque, matricule, id_driver],
    (err, result) => {
      if (err) {
        console.error("Error inserting trip:", err);
        return res.status(500).json({ error: "Database error", details: err });
      }
      res.status(201).json({ message: "Trip added successfully", tripId: result.insertId });
    }
  );
});
app.get("/trips", (req, res) => {
  db.query("SELECT * FROM trajet", (err, results) => {
    if (err) {
      res.status(500).json({ error: "Database error", details: err });
    } else {
      res.json(results);
    }
  });
});
// get user by id
app.get("/user/:id", verifyToken, (req, res) => {
  const userId = req.params.id;

  db.query("SELECT * FROM utilisateur WHERE id = ?", [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", details: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    res.json(results[0]);
  });
});
// Update user endpoint
app.put('/user/update', verifyToken, (req, res) => {
 // const { id } = req.userId; // Get the user ID from the token
  const { id,nom, prenom, email, num_telephone, cin, date_naissance, sexe, ville } = req.body;
  if (!nom || !prenom || !email || !num_telephone || !cin || !date_naissance || !sexe || !ville) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    UPDATE utilisateur SET 
      nom = ?, 
      prenom = ?, 
      email = ?, 
      num_telephone = ?, 
      cin = ?, 
      date_naissance = ?, 
      sexe = ?, 
      ville = ? 
    WHERE id = ?`;

  const values = [nom, prenom, email, num_telephone, cin, date_naissance, sexe, ville, id];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      return res.status(500).json({ message: 'Failed to update user' });
    }

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'User updated successfully' });
    } else {
      return res.status(404).json({ message: 'User not found' });
    }
  });
});
// booking
app.post("/book-trip", verifyToken, (req, res) => {
  const { id_trajet, id_user } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }

    const insertReservationQuery = `
      INSERT INTO bookings (id_trajet, id_passenger) VALUES (?, ?)
    `;
    db.query(insertReservationQuery, [id_trajet, id_user], (err, result) => {
      if (err) {
        return db.rollback(() => {
          // Handle duplicate booking gracefully
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "You have already booked this trip." });
          }
          return res.status(500).json({ error: "Database error", details: err });
        });
      }

      const updateNbrPlacesQuery = `
        UPDATE trajet SET nbr_places = nbr_places - 1 
        WHERE id_trajet = ? AND nbr_places > 0
      `;
      db.query(updateNbrPlacesQuery, [id_trajet], (err, updateResult) => {
        if (err) {
          return db.rollback(() => {
            return res.status(500).json({ error: "Database error", details: err });
          });
        }

        if (updateResult.affectedRows === 0) {
          return db.rollback(() => {
            return res.status(400).json({ error: "No available seats for this trip." });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              return res.status(500).json({ error: "Database error", details: err });
            });
          }

          res.status(201).json({
            message: "Trip booked successfully",
            reservationId: result.insertId
          });
        });
      });
    });
  });
});
//----------------------------------------------------- get trips by passenger ID -------------------------------------
app.get("/passenger-trips/:id", verifyToken, (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT t.*,b.* FROM trajet t
    JOIN bookings b ON t.id_trajet = b.id_trajet
    WHERE b.id_passenger = ?
  `;
  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", details: err });
    res.json(results);
  });
});

//----------------------------------- get trips by driver ID -----------------------------------------------------------------------
app.get("/driver-trips/:id", verifyToken, (req, res) => {
  const userId = req.params.id;
//   JOIN bookings b ON t.id_trajet = b.id_trajet

  const sql = `
    SELECT t.*FROM trajet t
    WHERE t.id_driver = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", details: err });
    res.json(results);
  });
});

// View a trip
app.get('/view-trip/:id',verifyToken, (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM trajet WHERE id_trajet = ?', [id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).send({ message: 'Trip not found' });
    res.send(result[0]);
  });
});

// Edit a trip
app.put('/edit-trip/:id',verifyToken, (req, res) => {
  const id = req.params.id;
  const data = req.body;
  db.query('UPDATE trajet SET ? WHERE id_trajet = ?', [data, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Trip updated successfully' });
  });
});

// Delete a trip
app.delete('/delete-trip/:id',verifyToken, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM trajet WHERE id_trajet = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send({ message: 'Trip deleted successfully' });
  });
});
// Start server
const PORT = process.env.PORT || 5090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

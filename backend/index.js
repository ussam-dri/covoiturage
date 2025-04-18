require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "10h" });
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
  const query = `
    SELECT t.*, u.nom, u.prenom, u.rating 
    FROM trajet t 
    JOIN utilisateur u ON t.id_driver = u.id
  `;

  db.query(query, (err, results) => {
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

        // Get passenger email
        const getEmailQuery = `SELECT email, nom, prenom FROM utilisateur WHERE id = ?`;
        db.query(getEmailQuery, [id_user], (err, emailResult) => {
          if (err || emailResult.length === 0) {
            return db.rollback(() => {
              return res.status(500).json({ error: "Error fetching user email", details: err });
            });
          }

          const { email, nom, prenom } = emailResult[0];

          // Get trip info for email
          const getTripDetailsQuery = `SELECT * FROM trajet WHERE id_trajet = ?`;
          db.query(getTripDetailsQuery, [id_trajet], (err, tripResult) => {
            if (err || tripResult.length === 0) {
              return db.rollback(() => {
                return res.status(500).json({ error: "Error fetching trip details", details: err });
              });
            }

            const trip = tripResult[0];

            // Nodemailer configuration
            const transporter = nodemailer.createTransport({
             
              host: 'covoiturage.zelobrix.com',
              port: 465,
              secure: true,
              auth: {
                user: 'admin@covoiturage.zelobrix.com',         // replace with your email
                pass: '0V=3=yku0ol*'  // use app password if 2FA
              },
              tls: {
                rejectUnauthorized: false
              }
            });

            const mailOptions = {
              from: 'admin@covoiturage.zelobrix.com',
              to: email,
              subject: 'Booking Confirmation - Covoiturage App',
              html: `
                <h3>Bonjour ${prenom} ${nom},</h3>
                <p>Votre réservation a été effectuée avec succès !</p>
                <h4>Détails du trajet :</h4>
                <ul>
                  <li><strong>Départ:</strong> ${trip.ville_depart}</li>
                  <li><strong>Arrivée:</strong> ${trip.ville_arriver}</li>
                  <li><strong>Date:</strong> ${trip.date_depart}</li>
                  <li><strong>Heure:</strong> ${trip.heure_depart}</li>
                  <li><strong>Prix:</strong> ${trip.prix} DH</li>
                </ul>
                <p>Merci d'avoir utilisé notre plateforme !</p>
              `
            };

            transporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.error("Email sending failed:", err);
                // You may choose to still commit even if email fails
              }

              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    return res.status(500).json({ error: "Database commit error", details: err });
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
    });
  });
});

//----------------------------------------------------- get trips by passenger ID -------------------------------------
app.get("/passenger-trips/:id", verifyToken, (req, res) => {
  const userId = req.params.id;
  const sql = `
    SELECT t.*,b.id_trajet,b.id_passenger FROM trajet t
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
// rate driver and update driver rating
app.post("/passenger/rate-driver", verifyToken, (req, res) => {
  const { id_driver, rating,id_passenger } = req.body;
  const userId = req.user.id; // Get the user ID from the token
const message_optional = req.body.message || null; // Optional message field
  // Insert rating into the database
  db.query(
    "INSERT INTO driverProfile (id_driver, id_passenger, rating,message) VALUES (?, ?, ?,?)",
    [id_driver, id_passenger, rating,message_optional],
    (err) => {
      if (err) return res.status(500).json({ message: "Database error", details: err });

      // Update driver's average rating
      db.query(
        "UPDATE utilisateur SET rating = (SELECT AVG(rating) FROM driverProfile WHERE id_driver = ?) WHERE id = ?",
        [id_driver, id_driver],
        (err) => {
          if (err) return res.status(500).json({ message: "Database error", details: err });
          res.json({ message: "Rating submitted successfully" });
        }
      );
    }
  );
});
//driver's profile
app.get("/driver/:id/reviews", verifyToken, (req, res) => {
  const id = req.params.id;

  const query = `
    SELECT r.id_passenger, r.rating, r.message, r.created_at, u.nom AS passenger_nom, u.prenom AS passenger_prenom
    FROM driverProfile r
    JOIN utilisateur u ON u.id = r.id_passenger
    WHERE r.id_driver = ?
    ORDER BY r.created_at DESC
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", details: err });
    }

    res.json(result); // return full list of reviews
  });
});
// cancel trip
app.delete("/cancel-trip/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM bookings WHERE id_trajet = ?", [id], (err) => {
    if (err) return res.status(500).json({ message: "Database error", details: err });
    res.json({ message: "Trip canceled successfully" });
  });
});
// get all reviews for a driver
app.get("/driver/reviews/:id", verifyToken, (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT r.*, u.nom AS passenger_nom, u.prenom AS passenger_prenom
    FROM driverProfile r
    JOIN utilisateur u ON u.id = r.id_passenger
    WHERE r.id_driver = ?
  `;
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", details: err });
    res.json(results);
  });
});

/// -------------- email verification ------------------
const transporter = nodemailer.createTransport({
             
  host: 'covoiturage.zelobrix.com',
  port: 465,
  secure: true,
  auth: {
    user: 'admin@covoiturage.zelobrix.com',         // replace with your email
    pass: '0V=3=yku0ol*'  // use app password if 2FA
  },
  tls: {
    rejectUnauthorized: false
  }
});
// ---------------------------  password reset request -----------------------------------------
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;

  const findUserQuery = `SELECT * FROM utilisateur WHERE email = ?`;
  db.query(findUserQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(404).json({ message: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    const updateUserQuery = `
      UPDATE utilisateur SET reset_token = ?, reset_token_expiry = ?
      WHERE email = ?
    `;
    db.query(updateUserQuery, [resetToken, expires, email], (err) => {
      if (err) return res.status(500).json({ message: 'Error saving reset token', error: err });

      const resetLink = `http://backend-codrive.zelobrix.com/reset-password/${resetToken}`;

      const mailOptions = {
        from: '"CoDrive" <admin@covoiturage.zelobrix.com>',
        to: email,
        subject: 'Password Reset Link',
        text: `Click on this link to reset your password: ${resetLink}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ message: 'Email error', error });
        }

        res.status(200).json({ message: 'Password reset link sent to your email' });
      });
    });
  });
});
// reset password
app.post('/reset-password/:token', async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  const findUserQuery = `
    SELECT * FROM utilisateur 
    WHERE reset_token = ? AND reset_token_expiry > NOW()
  `;
  db.query(findUserQuery, [token], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid or expired token' });

    const user = results[0];
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatePasswordQuery = `
      UPDATE utilisateur 
      SET password = ?, reset_token = NULL, reset_token_expiry = NULL 
      WHERE id = ?
    `;
    db.query(updatePasswordQuery, [hashedPassword, user.id], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating password', error: err });

      res.json({ message: 'Password updated successfully' });
    });
  });
});
//change password
app.post('/change-password', async (req, res) => {
  const { Newpassword, id } = req.body;

  const hashedPassword = await bcrypt.hash(Newpassword, 10);

  const updatePasswordQuery = `UPDATE utilisateur SET password = ? WHERE id = ?`;
  db.query(updatePasswordQuery, [hashedPassword, id], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error', error: err });

    res.status(200).json({ message: "Password changed successfully" });
  });
});
//
// Start server
const PORT = process.env.PORT || 5090;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

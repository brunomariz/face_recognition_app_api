/*
Project outline - first ideas:

/ -> res = Its alive!
/signin -> POST = success/fail
/register -> POST = user 
/profile/:user_id -> GET = user
/image -> PUT = user
*/

// Import express
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const { bindComplete } = require("pg-protocol/dist/messages");
const db = require("knex")({
  client: "pg",
  connection: {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "secret",
    database: "smart-brain",
  },
});

// Instantiate app
const app = express();

// Parse json body
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  db.select("*")
    .from("users")
    .then((users) => {
      res.json(users);
    })
    .catch((err) => res.status(err).json("Error getting users."));
});

// Signing in
app.post("/signin", (req, res) => {
  db("users")
    .select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then((data) => {
      const is_valid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (is_valid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then((user) => {
            res.json(user[0]);
          })
          .catch((err) => res.status(400).json("Error signing in."));
      } else {
        res.status(400).json("Wrong credentials.");
      }
    })
    .catch((err) => res.status(400).json("Wrong credentials."));
});

// Registering
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  // Hash the password
  const hash = bcrypt.hashSync(password);
  // Create a transaction
  db.transaction((trx) => {
    trx
      // Add hashed password and email to login database
      .insert({ hash, email })
      .into("login")
      .returning("email")
      .then((login_email) => {
        // Add new user to users database
        trx("users")
          .insert({ email: login_email[0].email, name, joined: new Date() })
          .returning("*")
          .then((user) => {
            // Respond with new user
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json("unable to register"));
});

// Profile
app.get("/profile/:user_id", (req, res) => {
  const { user_id } = req.params;
  // Find user by id and respond with user
  db.select("*")
    .from("users")
    .where({ id: user_id })
    .then((user) => {
      if (user.length) {
        res.json(user[0]);
      } else {
        res.status(400).json("Unable to find user.");
      }
    })
    .catch((err) => res.status(400).json("Error getting user."));
});

// Image
app.put("/image", (req, res) => {
  const { id } = req.body;
  // Find user by id and increment their entry count
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("Unable to get entries"));
});

// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });

// Define server port
app.listen(3002, () => {
  console.log("Server is running on port 3002.");
});

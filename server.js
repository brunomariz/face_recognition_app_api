/*
Project outline - first ideas:

/ -> res = Its alive!
/signin -> POST = success/fail
/register -> POST = user 
/profile/:user_id -> GET = user
/image -> PUT = user
*/

// Imports
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const { bindComplete } = require("pg-protocol/dist/messages");

const { Pool } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

// Instantiate app
const app = express();

// Parse json body
app.use(express.json());
app.use(cors());

// Root route
app.get("/", (req, res) => {
  // db.select("*")
  //   .from("users")
  //   .then((users) => {
  //     res.json(users);
  //   })
  //   .catch((err) => res.status(err).json("Error getting users."));
  res.send("its alive!!");
});

app.get("/db", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const results = { results: result ? result.rows : null };
    res.render("pages/db", results);
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

// Signing in
app.post("/signin", (req, res) => {
  signin.handle_signin(req, res, bcrypt, db);
});

// Registering
app.post("/register", (req, res) => {
  register.handle_register(req, res, bcrypt, db);
});

// Profile
app.get("/profile/:user_id", (req, res) => {
  profile.handle_profile(req, res, db);
});

// Image
app.put("/image", (req, res) => {
  image.handle_image(req, res, db);
});
app.post("/imageurl", (req, res) => {
  image.handle_api_call(req, res);
});

// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });

// Define server port
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});

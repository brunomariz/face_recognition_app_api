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

const db = require("knex")({
  client: "pg",
  connection: {
    host: "postgresql-defined-92257",
    port: 5432,
    user: "seflecndudkyqw",
    password:
      "16148d00c5bc274a4f9cd99810e23ae8f99bb664abdb8d35e58d331cd3ca18e1",
    database: "dfqgqipk4fl5t1",
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

/*
Project outline - first ideas:

/ -> res = Its alive!
/signin -> POST = success/fail
/register -> POST = user 
/profile/:user_id -> GET = user
/image -> PUT = user
*/

// Create database
const database = {
  users: [
    {
      id: 123,
      name: "Cameron",
      password: "winsconsin",
      email: "cam@gmail.com",
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: "Alex",
      password: "science",
      email: "alex@gmail.com",
      entries: 0,
      joined: new Date(),
    },
  ],
  login: {
    id: "987",
    hash: "",
    email: "john@gmail",
  },
};

// Import express
const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
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
  res.json(database);
});

// Signing in
app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  // Load hash from your password DB.
  // bcrypt.compare(
  //   password,
  //   "$2a$10$qjtBD2hcLjvo3X5rEUrMnOqeWtM4zUKe4sik4GGoNFbAew2k9X6Ma",
  //   function (err, res) {
  //     console.log(password, res);
  //   }
  // );

  // Check if valid user
  if (
    email == database.users[1].email &&
    password == database.users[1].password
  ) {
    res.json(database.users[1]);
  } else {
    res.status(400).json("Incorrect username or password");
  }
});

// Registering
app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  // Add new user to database
  db("users")
    .insert({ email, name, joined: new Date() })
    .returning("*")
    .then((user) => {
      // Respond with new user
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json("unable to register"));
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
    .catch((err) => res.status(err).json("Error getting user."));
});

// Image
app.put("/image", (req, res) => {
  const { id } = req.body;
  // Find user by id and increment their entry count
  database.users.forEach((user) => {
    if (user.id == id) {
      user.entries += 1;
      res.json(user.entries);
      return;
    }
  });
});

// bcrypt.compare("veggies", hash, function (err, res) {
//   // res = false
// });

// Define server port
app.listen(3002, () => {
  console.log("Server is running on port 3002.");
});

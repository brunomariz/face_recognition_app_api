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
  // Add id and entries to new user
  const newUser = {
    name,
    email,
    id: 125,
    entries: 0,
    joined: new Date(),
  };
  // Add new user to database
  database.users.push(newUser);
  // Respond with new user
  res.json(database.users[database.users.length - 1]);
});

// Profile
app.get("/profile/:user_id", (req, res) => {
  const { user_id } = req.params;
  // Find user by id and respond with user
  const user = database.users.filter((user) => {
    return user.id == user_id;
  });
  if (user.length > 0) {
    res.json(user);
  } else {
    res.status(404).json("User not found.");
  }
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

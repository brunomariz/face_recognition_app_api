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
      email: "cam@gmail.com",
      password: "winsconsin",
      entries: 0,
      joined: new Date(),
    },
    {
      id: 124,
      name: "Alex",
      email: "alex@gmail.com",
      password: "science",
      entries: 0,
      joined: new Date(),
    },
  ],
};

// Import express
const express = require("express");

// Instantiate app
const app = express();

// Parse json body
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.json(database);
});

// Signing in
app.post("/signin", (req, res) => {
  // Check if valid user
  if (
    req.body.email == database.users[1].email &&
    req.body.password == database.users[1].password
  ) {
    res.json("Signed in!");
  } else {
    res.status(400).json("Incorrect username or password");
  }
});

// Registering
app.post("/register", (req, res) => {
  // Add id and entries to new user
  const newUser = {
    ...req.body,
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

// Define server port
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

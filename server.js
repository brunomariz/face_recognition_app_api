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
  res.send("Its alive!!");
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
app.post("/register", (req, res) => {});

// Define server port
app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

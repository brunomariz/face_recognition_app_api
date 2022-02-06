/*
Project outline - first ideas:

/ -> res = Its alive!
/signin -> POST = success/fail
/register -> POST = user 
/profile/:user_id -> GET = user
/image -> PUT = user
*/

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Its alive!!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});

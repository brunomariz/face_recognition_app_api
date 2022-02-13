const handle_signin = (req, res, bcrypt, db) => {
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
};

module.exports = {
  handle_signin: handle_signin,
};

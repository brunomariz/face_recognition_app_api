const handle_signin = (req, res, bcrypt, db) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json("Incorrect form submission.");
  }

  db("users")
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then((data) => {
      const is_valid = bcrypt.compareSync(password, data[0].hash);
      if (is_valid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
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

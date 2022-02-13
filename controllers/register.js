const handle_register = (req, res, bcrypt, db) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json("Incorrect form submission.");
  }
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
};

module.exports = {
  handle_register: handle_register,
};

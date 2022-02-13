const handle_profile = (req, res, db) => {
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
    .catch((err) => res.status(400).json("Error getting user."));
};

module.exports = {
  handle_profile: handle_profile,
};

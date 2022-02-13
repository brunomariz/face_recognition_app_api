const handle_image = (req, res, db) => {
  const { id } = req.body;
  // Find user by id and increment their entry count
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then((entries) => res.json(entries[0].entries))
    .catch((err) => res.status(400).json("Unable to get entries"));
};

module.exports = {
  handle_image: handle_image,
};

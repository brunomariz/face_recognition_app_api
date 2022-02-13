const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "43d138007659406db4d72ee94fb98bd0",
});

const handle_api_call = (req, res) => {
  app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      // THE JPG
      req.body.input
    )
    .then((data) => {
      res.json(data);
    })
    .catch((err) => res.status(400).json("Error fetching model"));
};

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
  handle_api_call: handle_api_call,
};

const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("./auth");
let User = mongoose.model("User");

router.param("username", (req, res, next, username) => {
  User.findOne({ username: username })
    .then(user => {
      if (!user) {
        res.sendStatus(404); 
      }

      req.profile = user;

      return next();
    })
    .catch(next);
});

router.get("/:username", auth.optional, (req, res, next) => {
  if (req.payload) {
    User.findById(req.payload.id).then(user => {
      if (!user) {
        return res.json({ profile: req.profile.profileJSON(false) });
      }

      return res.json({ profile: req.profile.profileJSON(user) });
    });
  } else {
    return res.json({ profile: req.profile.profileJSON(false) });
  }
});

module.exports = router;

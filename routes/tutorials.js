const router = require("express").Router();
const mongoose = require("mongoose");
const auth = require("./auth");
let User = mongoose.model("User");
let Tutorial = mongoose.model("Tutorial");

router.get("/", auth.optional, function(req, res, next) {
  var query = {};
  var limit = 10;
  var offset = 0;

  if (typeof req.query.limit !== "undefined") {
    limit = req.query.limit;
  }

  if (typeof req.query.offset !== "undefined") {
    offset = req.query.offset;
  }

  if (req.query.author) {
    User.findOne({});
  }
  Promise.all([
    req.query.author ? User.findOne({ username: req.query.author }) : null
  ])
    .then(function(author) {
      if (author) {
        query.author = author._id;
      }

      return Promise.all([
        Tutorial.find(query) // [0]
          .limit(Number(limit))
          .skip(Number(offset))
          .sort({ createdAt: "desc" })
          .populate("author")
          .exec(),
        Tutorial.countDocuments(query).exec(), // [1]
        req.auth ? User.findById(req.auth.id) : null // [2]
      ]).then(function(results) {
        var tutorials = results[0];
        var tutorialsCount = results[1];
        var user = results[2];

        return res.json({
          tutorials: tutorials.map(function(tutorial) {
            return tutorial.tutorialJSON(user);
          }),
          tutorialsCount: tutorialsCount
        });
      });
    })
    .catch(next);
});

router.post("/", auth.optional, function(req, res, next) {
    User.findById(req.auth.id).then(function(user) {
        var tutorial = new Tutorial(req.body.tutorial);
  
        return tutorial.save().then(function(){
            return res.json({tutorial: tutorial.tutorialJSON()});            
        });
    }).catch(next);
});

module.exports = router;

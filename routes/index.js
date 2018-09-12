const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../README.md"));
});

router.use("/users", require("./users"));

router.use("/profiles", require("./profiles"));

module.exports = router;

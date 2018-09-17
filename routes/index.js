const router = require("express").Router();
const path = require("path");

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../README.md"));
});

router.use("/users", require("./users"));

router.use("/profiles", require("./profiles"));

router.use("/tutorials", require("./tutorials"));

module.exports = router;

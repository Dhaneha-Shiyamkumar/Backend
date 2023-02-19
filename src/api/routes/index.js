const express = require("express");
const userRouter = require("./users.route");

const router = express.Router();

router.get("/", (req, res) => {
  console.log(userRouter);
  res.send("Hello World!");
});

router.use("/users", userRouter);

module.exports = router;

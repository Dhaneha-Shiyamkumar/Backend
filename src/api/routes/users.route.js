const express = require("express");
const {
  getUsers,
  createUser,
  userAuth,
} = require("../controllers/user.controller");

const router = express.Router();

router.get(
  "/all",
  (req, res, next) => {},
  () => {
    return {
      helo: "world",
    };
  }
);

router.post("/create", createUser);
router.post("/login", userAuth);

module.exports = router;

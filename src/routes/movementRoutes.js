const express = require("express");
const router = express.Router();

const {
  createMovement,
} = require("../controllers/movementController");

router.post("/", createMovement);

module.exports = router;
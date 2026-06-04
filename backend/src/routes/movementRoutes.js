const express = require("express");
const router = express.Router();

const {
  getMovements,
  getMovementById,
  createMovement,
} = require("../controllers/movementController");

const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", roleMiddleware("admin", "operator"), getMovements);
router.get("/:id", roleMiddleware("admin", "operator"), getMovementById);
router.post("/", roleMiddleware("admin", "operator"), createMovement);

module.exports = router;
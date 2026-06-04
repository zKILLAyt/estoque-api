const express = require("express");
const router = express.Router();

const {
  getDashboard,
} = require("../controllers/dashboardController");

const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", roleMiddleware("admin", "operator"), getDashboard);

module.exports = router;
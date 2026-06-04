const express = require("express");
const router = express.Router();

const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/", roleMiddleware("admin", "operator"), getProducts);
router.get("/:id", roleMiddleware("admin", "operator"), getProductById);

router.post("/", roleMiddleware("admin"), createProduct);
router.put("/:id", roleMiddleware("admin"), updateProduct);
router.delete("/:id", roleMiddleware("admin"), deleteProduct);

module.exports = router;
const connection = require("../database/connection");

const getProducts = (req, res) => {
  connection.query(
    "SELECT * FROM products",
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.json(results);
    }
  );
};

const createProduct = (req, res) => {
  console.log(req.body);

  const {
    name,
    sku,
    quantity,
    min_quantity,
    price,
    category_id,
    supplier_id
  } = req.body;

  const sql = `
    INSERT INTO products
    (name, sku, quantity, min_quantity, price, category_id, supplier_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  connection.query(
    sql,
    [
      name,
      sku,
      quantity,
      min_quantity,
      price,
      category_id,
      supplier_id
    ],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: err.message
        });
      }

      res.status(201).json({
        message: "Produto criado com sucesso!",
        id: result.insertId
      });
    }
  );
};

const getProductById = (req, res) => {
  const { id } = req.params;

  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [id],
    (err, results) => {
      if (err) {
        return res.status(500).json({
          error: err.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "Produto não encontrado",
        });
      }

      res.json(results[0]);
    }
  );
};

module.exports = {
  getProducts,
  createProduct,
  getProductById,
};
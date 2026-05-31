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

module.exports = {
  getProducts,
};
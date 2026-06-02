const connection = require("../database/connection");

const createMovement = (req, res) => {
  const {
    product_id,
    user_id,
    movement_type,
    quantity,
    observation
  } = req.body;

  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [product_id],
    (err, products) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (products.length === 0) {
        return res.status(404).json({
          message: "Produto não encontrado"
        });
      }

      const product = products[0];
      let newQuantity = product.quantity;

      if (movement_type === "entrada") {
        newQuantity += quantity;
      }

      if (movement_type === "saida") {
        if (product.quantity < quantity) {
          return res.status(400).json({
            message: "Estoque insuficiente"
          });
        }

        newQuantity -= quantity;
      }

      connection.query(
        "UPDATE products SET quantity = ? WHERE id = ?",
        [newQuantity, product_id],
        (err) => {
          if (err) {
            return res.status(500).json({
              error: err.message
            });
          }

          connection.query(
            `
            INSERT INTO movements
            (product_id, user_id, movement_type, quantity, observation)
            VALUES (?, ?, ?, ?, ?)
            `,
            [
              product_id,
              user_id,
              movement_type,
              quantity,
              observation
            ],
            (err, result) => {
              if (err) {
                return res.status(500).json({
                  error: err.message
                });
              }

              res.status(201).json({
                message: "Movimentação registrada com sucesso!",
                movementId: result.insertId,
                newQuantity
              });
            }
          );
        }
      );
    }
  );
};

module.exports = {
  createMovement,
};
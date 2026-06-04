const connection = require("../database/connection");

const getMovements = (req, res) => {
  const sql = `
    SELECT
      movements.id,
      movements.product_id,
      products.name AS product_name,
      products.sku AS product_sku,
      movements.user_id,
      users.name AS user_name,
      movements.movement_type,
      movements.quantity,
      movements.observation,
      movements.created_at
    FROM movements
    INNER JOIN products ON movements.product_id = products.id
    INNER JOIN users ON movements.user_id = users.id
    ORDER BY movements.created_at DESC
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    res.json(results);
  });
};

const getMovementById = (req, res) => {
  const { id } = req.params;

  const sql = `
    SELECT
      movements.id,
      movements.product_id,
      products.name AS product_name,
      products.sku AS product_sku,
      movements.user_id,
      users.name AS user_name,
      movements.movement_type,
      movements.quantity,
      movements.observation,
      movements.created_at
    FROM movements
    INNER JOIN products ON movements.product_id = products.id
    INNER JOIN users ON movements.user_id = users.id
    WHERE movements.id = ?
  `;

  connection.query(sql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: err.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Movimentacao nao encontrada",
      });
    }

    res.json(results[0]);
  });
};

const createMovement = (req, res) => {
  const {
    product_id,
    user_id,
    movement_type,
    quantity,
    observation
  } = req.body || {};

  if (!product_id || !user_id || !movement_type || !quantity) {
    return res.status(400).json({
      message: "Produto, usuario, tipo de movimentacao e quantidade sao obrigatorios",
    });
  }

  if (!["entrada", "saida"].includes(movement_type)) {
    return res.status(400).json({
      message: "Tipo de movimentacao invalido",
    });
  }

  connection.query(
    "SELECT * FROM products WHERE id = ?",
    [product_id],
    (err, products) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (products.length === 0) {
        return res.status(404).json({
          message: "Produto nao encontrado"
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
                message: "Movimentacao registrada com sucesso!",
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
  getMovements,
  getMovementById,
  createMovement,
};

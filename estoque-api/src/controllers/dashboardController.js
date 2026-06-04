const connection = require("../database/connection");

const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }

      resolve(results);
    });
  });
};

const getDashboard = async (req, res) => {
  try {
    const [totalProdutos] = await query(
      "SELECT COUNT(*) AS totalProdutos FROM products"
    );

    const [totalCategorias] = await query(
      "SELECT COUNT(*) AS totalCategorias FROM categorias"
    );

    const [totalFornecedores] = await query(
      "SELECT COUNT(*) AS totalFornecedores FROM suppliers"
    );

    const [estoqueBaixo] = await query(`
      SELECT COUNT(*) AS estoqueBaixo
      FROM products
      WHERE quantity <= min_quantity
    `);

    const [valorTotalEstoque] = await query(`
      SELECT SUM(quantity * price) AS valorTotalEstoque
      FROM products
    `);

    const ultimosProdutos = await query(`
      SELECT
        id,
        name,
        sku,
        quantity,
        min_quantity,
        price,
        created_at
      FROM products
      ORDER BY created_at DESC
      LIMIT 5
    `);

    const ultimasMovimentacoes = await query(`
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
      LIMIT 5
    `);

    const produtosEstoqueCritico = await query(`
      SELECT
        id,
        name,
        sku,
        quantity,
        min_quantity
      FROM products
      WHERE quantity <= min_quantity
      ORDER BY quantity ASC
    `);

    const topProdutosMovimentados = await query(`
      SELECT
        products.id,
        products.name,
        products.sku,
        SUM(movements.quantity) AS total_movimentado
      FROM movements
      INNER JOIN products ON movements.product_id = products.id
      GROUP BY products.id, products.name, products.sku
      ORDER BY total_movimentado DESC
      LIMIT 5
    `);

    const valorTotalPorCategoria = await query(`
      SELECT
        categorias.id,
        categorias.name AS category_name,
        SUM(products.quantity * products.price) AS valor_total
      FROM products
      INNER JOIN categorias ON products.category_id = categorias.id
      GROUP BY categorias.id, categorias.name
      ORDER BY valor_total DESC
    `);

    res.json({
      totalProdutos: totalProdutos.totalProdutos,
      totalCategorias: totalCategorias.totalCategorias,
      totalFornecedores: totalFornecedores.totalFornecedores,
      estoqueBaixo: estoqueBaixo.estoqueBaixo,
      valorTotalEstoque: valorTotalEstoque.valorTotalEstoque || 0,
      ultimosProdutos,
      ultimasMovimentacoes,
      produtosEstoqueCritico,
      topProdutosMovimentados,
      valorTotalPorCategoria,
    });
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  getDashboard,
};
const connection = require("../database/connection");

const getDashboard = (req, res) => {
    const dashboard = {};

    connection.query(
        "SELECT COUNT(*) AS totalProdutos FROM products",
        (err, products) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            dashboard.totalProdutos = products[0].totalProdutos;

            connection.query(
                "SELECT COUNT(*) AS totalCategorias FROM categorias",
                (err, categories) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    dashboard.totalCategorias = categories[0].totalCategorias;

                    connection.query(
                        "SELECT COUNT(*) AS totalFornecedores FROM suppliers",
                        (err, suppliers) => {
                            if (err) {
                                return res.status(500).json({ error: err.message });
                            }

                            dashboard.totalFornecedores = suppliers[0].totalFornecedores;

                            connection.query(
                                `
                SELECT COUNT(*) AS estoqueBaixo
                FROM products
                WHERE quantity <= min_quantity
                `,
                                (err, lowStock) => {
                                    if (err) {
                                        return res.status(500).json({
                                            error: err.message,
                                        });
                                    }

                                    dashboard.estoqueBaixo = lowStock[0].estoqueBaixo;

                                    connection.query(
                                        `
                SELECT SUM(quantity * price) AS valorTotalEstoque
                FROM products
                `,
                                        (err, totalValue) => {
                                            if (err) {
                                                return res.status(500).json({
                                                    error: err.message,
                                                });
                                            }

                                            dashboard.valorTotalEstoque =
                                                totalValue[0].valorTotalEstoque || 0;

                                            res.json(dashboard);
                                        },
                                    );
                                },
                            );
                        },
                    );
                },
            );
        },
    );
};

module.exports = {
    getDashboard,
};

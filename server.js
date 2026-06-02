require("dotenv").config();

const express = require("express");
const cors = require("cors");

const productRoutes = require("./src/routes/productRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const movementRoutes = require("./src/routes/movementRoutes");

const app = express();

app.use(cors());
app.use(express.json());

require("./src/database/connection");

app.use("/products", productRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/movements", movementRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API de Estoque funcionando!",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
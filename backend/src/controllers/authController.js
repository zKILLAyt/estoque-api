const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const connection = require("../database/connection");

const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "Nome, email e senha sao obrigatorios",
    });
  }

  const userRole = role || "operator";
  const allowedRoles = ["admin", "operator"];

  if (!allowedRoles.includes(userRole)) {
    return res.status(400).json({
      message: "Role invalida",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      message: "JWT_SECRET nao configurado",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(sql, [name, email, hashedPassword, userRole], (err, result) => {
      if (err) {
        console.error("ERRO MYSQL REGISTER:", err);

        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Email ja cadastrado",
          });
        }

        return res.status(500).json({
          error: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      }

      res.status(201).json({
        message: "Usuario cadastrado com sucesso!",
        userId: result.insertId,
      });
    });
  } catch (err) {
    console.error("ERRO REGISTER:", err);

    res.status(500).json({
      error: err.message,
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email e senha sao obrigatorios",
    });
  }

  connection.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, results) => {
      if (err) {
        console.error("ERRO MYSQL LOGIN:", err);

        return res.status(500).json({
          error: err.message,
          code: err.code,
          sqlMessage: err.sqlMessage,
        });
      }

      if (results.length === 0) {
        return res.status(401).json({
          message: "Email ou senha invalidos",
        });
      }

      const user = results[0];

      const passwordIsValid = await bcrypt.compare(password, user.password);

      if (!passwordIsValid) {
        return res.status(401).json({
          message: "Email ou senha invalidos",
        });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          message: "JWT_SECRET nao configurado",
        });
      }

      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({
        message: "Login realizado com sucesso!",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }
  );
};

module.exports = {
  register,
  login,
};
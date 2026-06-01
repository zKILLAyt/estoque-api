# 📦 Estoque API

API REST para gerenciamento de estoque desenvolvida com Node.js, Express e MySQL.

## Tecnologias

* Node.js
* Express
* MySQL
* dotenv
* cors

## Estrutura do Projeto

```text
estoque-api/
│
├── src/
│   ├── controllers/
│   ├── routes/
│   └── database/
│
├── .env
├── .gitignore
├── server.js
├── package.json
└── README.md
```

##  Banco de Dados

O projeto utiliza MySQL com as seguintes tabelas:

* users
* categorias
* suppliers
* products
* movements

##  Instalação

Clone o repositório:

```bash
git clone https://github.com/zKILLAyt/estoque-api.git
```

Entre na pasta:

```bash
cd estoque-api
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=estoque_db
PORT=3000
```

Inicie o servidor:

```bash
node server.js
```

## Rotas

### Produtos

Buscar todos os produtos:

```http
GET /products
```

##  Status do Projeto

✅ Banco de dados criado

✅ Integração com MySQL

✅ API Express configurada

✅ Rota GET /products

🚧 CRUD completo de produtos em desenvolvimento

🚧 Autenticação JWT

🚧 Dashboard de estoque

##  Autor

Gustavo Gomes

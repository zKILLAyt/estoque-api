# Estoque Full Stack

Sistema de controle de estoque desenvolvido com Node.js, Express, MySQL, React e Vite.

O projeto foi criado como portfolio Full Stack, com foco em back-end, autenticacao JWT, controle de acesso por roles e integracao com uma interface web consumindo a API.

## Tecnologias

### Back-end

- Node.js
- Express
- MySQL
- mysql2
- bcryptjs
- jsonwebtoken
- dotenv
- cors

### Front-end

- React
- Vite
- JavaScript
- CSS
- lucide-react

## Funcionalidades

- Login com JWT
- Controle de acesso por roles (`admin` e `operator`)
- CRUD de produtos
- Dashboard com metricas basicas e avancadas
- Entrada e saida de estoque
- Historico de movimentacoes
- Interface web integrada com a API
- Criacao, edicao e exclusao de produtos pelo front-end
- Registro de movimentacoes pelo front-end

## Estrutura

```text
Projetec - Back-end/
|-- estoque-api/
|   |-- src/
|   |   |-- controllers/
|   |   |-- database/
|   |   |-- middlewares/
|   |   `-- routes/
|   |-- .env.example
|   |-- package.json
|   `-- server.js
|
`-- estoque-frontend/
    |-- src/
    |   |-- main.jsx
    |   `-- styles.css
    |-- .env.example
    |-- package.json
    `-- index.html
```

## Como Rodar Localmente

### 1. Back-end

Acesse a pasta da API:

```bash
cd estoque-api
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=estoque_db
PORT=3000
JWT_SECRET=sua_chave_secreta
```

Inicie a API:

```bash
npm run dev
```

A API ficara disponivel em:

```text
http://localhost:3000
```

### 2. Front-end

Em outro terminal, acesse a pasta do front-end:

```bash
cd estoque-frontend
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` com base no `.env.example`:

```env
VITE_API_URL=http://localhost:3000
```

Inicie o front-end:

```bash
npm run dev
```

O front-end ficara disponivel em:

```text
http://127.0.0.1:5173
```

## Rotas Principais da API

### Autenticacao

| Metodo | Rota | Descricao |
| --- | --- | --- |
| POST | `/auth/register` | Cadastra usuario |
| POST | `/auth/login` | Realiza login e retorna token JWT |

### Produtos

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/products` | Lista produtos |
| GET | `/products/:id` | Busca produto por ID |
| POST | `/products` | Cria produto |
| PUT | `/products/:id` | Atualiza produto |
| DELETE | `/products/:id` | Remove produto |

### Dashboard

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/dashboard` | Retorna metricas do estoque |

### Movimentacoes

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/movements` | Lista movimentacoes |
| GET | `/movements/:id` | Busca movimentacao por ID |
| POST | `/movements` | Registra entrada ou saida de estoque |

## Autenticacao

As rotas protegidas precisam receber o token JWT no header:

```http
Authorization: Bearer seu_token
```

Roles:

- `admin`: pode criar, editar e excluir produtos.
- `operator`: pode consultar dados e registrar movimentacoes.

## Status

Projeto funcional em ambiente local.

Concluido:

- API REST com Express
- Banco MySQL integrado
- Autenticacao JWT
- Controle por roles
- Dashboard avancado
- Front-end React integrado
- CRUD de produtos no front-end
- Movimentacoes no front-end

Proximos passos:

- Melhorar feedback visual de sucesso e erro
- Criar tela de cadastro de usuarios
- Criar telas de categorias e fornecedores
- Adicionar filtros e busca
- Fazer deploy com banco MySQL online

## Autor

Gustavo Gomes

# Estoque API

API REST para controle de estoque desenvolvida com Node.js, Express e MySQL.

O projeto foi criado como parte de um portfolio Full Stack, com foco em aprendizado de back-end, integracao com banco de dados relacional e boas praticas de organizacao de uma API.

## Tecnologias

- Node.js
- Express
- MySQL
- mysql2
- dotenv
- cors
- Git/GitHub
- Thunder Client

## Funcionalidades

- CRUD de produtos
- Dashboard com metricas basicas e avancadas do estoque
- Entrada de estoque
- Saida de estoque
- Registro de historico de movimentacoes
- Integracao com MySQL
- API REST com Express

## Estrutura do Projeto

```text
estoque-api/
|-- src/
|   |-- controllers/
|   |   |-- dashboardController.js
|   |   |-- movementController.js
|   |   `-- productController.js
|   |-- database/
|   |   `-- connection.js
|   `-- routes/
|       |-- dashboardRoutes.js
|       |-- movementRoutes.js
|       `-- productRoutes.js
|-- .env
|-- .gitignore
|-- package.json
|-- package-lock.json
|-- README.md
`-- server.js
```

## Banco de Dados

Banco utilizado:

```text
estoque_db
```

Tabelas principais:

- `products`
- `categorias`
- `suppliers`
- `users`
- `movements`

## Instalacao

Clone o repositorio:

```bash
git clone https://github.com/zKILLAyt/estoque-api.git
```

Acesse a pasta do projeto:

```bash
cd estoque-api
```

Instale as dependencias:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=estoque_db
PORT=3000
```

Inicie o servidor:

```bash
npm start
```

A API ficara disponivel em:

```text
http://localhost:3000
```

Para desenvolvimento com reinicio automatico:

```bash
npm run dev
```

## Variaveis de Ambiente

Use o arquivo `.env.example` como base para criar o seu `.env`.

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=estoque_db
PORT=3000
JWT_SECRET=sua_chave_secreta
```

Nunca envie o arquivo `.env` para o GitHub.

## Deploy

Antes de fazer deploy, configure as variaveis de ambiente na plataforma escolhida.

Comando de instalacao:

```bash
npm install
```

Comando de inicializacao:

```bash
npm start
```

O servidor usa a porta definida pela variavel `PORT`, exigida pela maioria das plataformas de deploy.

## Rotas

### Produtos

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/products` | Lista todos os produtos |
| GET | `/products/:id` | Busca um produto pelo ID |
| POST | `/products` | Cria um novo produto |
| PUT | `/products/:id` | Atualiza um produto existente |
| DELETE | `/products/:id` | Remove um produto |

Exemplo de criacao de produto:

```json
{
  "name": "Mouse Gamer",
  "sku": "MOU001",
  "quantity": 20,
  "min_quantity": 5,
  "price": 129.9,
  "category_id": 1,
  "supplier_id": 1
}
```

### Dashboard

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/dashboard` | Retorna metricas gerais e avancadas do estoque |

Exemplo de resposta:

```json
{
  "totalProdutos": 1,
  "totalCategorias": 1,
  "totalFornecedores": 1,
  "estoqueBaixo": 0,
  "valorTotalEstoque": 4497,
  "ultimosProdutos": [],
  "ultimasMovimentacoes": [],
  "produtosEstoqueCritico": [],
  "topProdutosMovimentados": [],
  "valorTotalPorCategoria": []
}
```

Metricas retornadas:

- Total de produtos
- Total de categorias
- Total de fornecedores
- Produtos com estoque baixo
- Valor total do estoque
- Ultimos produtos cadastrados
- Ultimas movimentacoes
- Produtos com estoque critico
- Top produtos movimentados
- Valor total por categoria

### Movimentacoes

| Metodo | Rota | Descricao |
| --- | --- | --- |
| GET | `/movements` | Lista o historico completo de movimentacoes |
| GET | `/movements/:id` | Busca uma movimentacao pelo ID |
| POST | `/movements` | Registra uma entrada ou saida de estoque |

Exemplo de entrada:

```json
{
  "product_id": 1,
  "user_id": 1,
  "movement_type": "entrada",
  "quantity": 10,
  "observation": "Compra de fornecedor"
}
```

Exemplo de saida:

```json
{
  "product_id": 1,
  "user_id": 1,
  "movement_type": "saida",
  "quantity": 5,
  "observation": "Venda para cliente"
}
```

## Proximos Passos

- Implementar autenticacao com JWT
- Adicionar controle de acesso por roles (`admin` e `operator`)
- Desenvolver front-end com React e Vite

## Status

Projeto em desenvolvimento.

Funcionalidades concluidas:

- CRUD completo de produtos
- Dashboard basico
- Dashboard avancado
- Controle de entrada e saida de estoque
- Registro de movimentacoes
- Listagem de historico de movimentacoes
- Busca de movimentacao por ID
- Integracao com MySQL

## Autor

Gustavo Gomes

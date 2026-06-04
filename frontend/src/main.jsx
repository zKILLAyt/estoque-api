import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowDownUp,
  BarChart3,
  Boxes,
  Check,
  Pencil,
  LogOut,
  PackagePlus,
  RefreshCw,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const initialProductForm = {
  name: "",
  sku: "",
  quantity: "",
  min_quantity: "",
  price: "",
  category_id: "",
  supplier_id: "",
};

const initialMovementForm = {
  product_id: "",
  user_id: "",
  movement_type: "entrada",
  quantity: "",
  observation: "",
};

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [activeView, setActiveView] = useState("dashboard");
  const [message, setMessage] = useState("");

  const isAuthenticated = Boolean(token);

  const api = useMemo(() => {
    return async (path, options = {}) => {
      const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...options.headers,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || data.error || "Erro na requisicao");
      }

      return data;
    };
  }, [token]);

  const handleLogin = async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Falha no login");
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setMessage("Login realizado com sucesso.");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser(null);
    setActiveView("dashboard");
    setMessage("");
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Boxes size={22} />
          </div>
          <div>
            <strong>Estoque</strong>
            <span>API Manager</span>
          </div>
        </div>

        <nav className="nav-list">
          <NavButton
            icon={<BarChart3 size={18} />}
            label="Dashboard"
            active={activeView === "dashboard"}
            onClick={() => setActiveView("dashboard")}
          />
          <NavButton
            icon={<Boxes size={18} />}
            label="Produtos"
            active={activeView === "products"}
            onClick={() => setActiveView("products")}
          />
          <NavButton
            icon={<ArrowDownUp size={18} />}
            label="Movimentacoes"
            active={activeView === "movements"}
            onClick={() => setActiveView("movements")}
          />
        </nav>

        <div className="user-panel">
          <div>
            <strong>{user?.name}</strong>
            <span>{user?.role}</span>
          </div>
          <button className="icon-button" type="button" title="Sair" onClick={handleLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      <main className="content">
        {message && <div className="notice">{message}</div>}

        {activeView === "dashboard" && <Dashboard api={api} />}
        {activeView === "products" && <Products api={api} user={user} />}
        {activeView === "movements" && <Movements api={api} user={user} />}
      </main>
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onLogin(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-panel">
        <div className="login-header">
          <div className="brand-icon">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1>Estoque API</h1>
            <p>Acesse o painel de controle</p>
          </div>
        </div>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </label>

          <label>
            Senha
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
              required
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button className={`nav-button ${active ? "active" : ""}`} type="button" onClick={onClick}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function Dashboard({ api }) {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    try {
      setDashboard(await api("/dashboard"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return <LoadingState text="Carregando dashboard..." />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadDashboard} />;
  }

  return (
    <section className="view">
      <ViewHeader
        title="Dashboard"
        action={
          <button className="secondary-button" type="button" onClick={loadDashboard}>
            <RefreshCw size={16} />
            Atualizar
          </button>
        }
      />

      <div className="metrics-grid">
        <Metric label="Produtos" value={dashboard.totalProdutos} />
        <Metric label="Categorias" value={dashboard.totalCategorias} />
        <Metric label="Fornecedores" value={dashboard.totalFornecedores} />
        <Metric label="Estoque baixo" value={dashboard.estoqueBaixo} />
        <Metric label="Valor em estoque" value={formatMoney(dashboard.valorTotalEstoque)} />
      </div>

      <div className="data-grid">
        <DataTable
          title="Ultimas movimentacoes"
          rows={dashboard.ultimasMovimentacoes}
          columns={[
            ["product_name", "Produto"],
            ["movement_type", "Tipo"],
            ["quantity", "Qtd."],
            ["created_at", "Data", formatDate],
          ]}
        />
        <DataTable
          title="Estoque critico"
          rows={dashboard.produtosEstoqueCritico}
          columns={[
            ["name", "Produto"],
            ["quantity", "Atual"],
            ["min_quantity", "Minimo"],
          ]}
        />
      </div>
    </section>
  );
}

function Products({ api, user }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editForm, setEditForm] = useState(initialProductForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === "admin";

  const loadProducts = async () => {
    setLoading(true);
    setError("");

    try {
      setProducts(await api("/products"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await api("/products", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity),
          min_quantity: Number(form.min_quantity),
          price: Number(form.price),
          category_id: Number(form.category_id),
          supplier_id: Number(form.supplier_id),
        }),
      });
      setForm(initialProductForm);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setEditForm({
      name: product.name || "",
      sku: product.sku || "",
      quantity: product.quantity ?? "",
      min_quantity: product.min_quantity ?? "",
      price: product.price ?? "",
      category_id: product.category_id ?? "",
      supplier_id: product.supplier_id ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setEditForm(initialProductForm);
  };

  const handleUpdate = async (productId) => {
    try {
      await api(`/products/${productId}`, {
        method: "PUT",
        body: JSON.stringify({
          ...editForm,
          quantity: Number(editForm.quantity),
          min_quantity: Number(editForm.min_quantity),
          price: Number(editForm.price),
          category_id: Number(editForm.category_id),
          supplier_id: Number(editForm.supplier_id),
        }),
      });
      cancelEdit();
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (productId) => {
    const confirmDelete = window.confirm("Deseja remover este produto?");

    if (!confirmDelete) {
      return;
    }

    try {
      await api(`/products/${productId}`, {
        method: "DELETE",
      });
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="view">
      <ViewHeader
        title="Produtos"
        action={
          <button className="secondary-button" type="button" onClick={loadProducts}>
            <RefreshCw size={16} />
            Atualizar
          </button>
        }
      />

      {error && <div className="error">{error}</div>}

      {isAdmin && (
        <form className="product-form" onSubmit={handleCreate}>
          <Field label="Nome" value={form.name} onChange={(value) => setForm({ ...form, name: value })} />
          <Field label="SKU" value={form.sku} onChange={(value) => setForm({ ...form, sku: value })} />
          <Field label="Qtd." type="number" value={form.quantity} onChange={(value) => setForm({ ...form, quantity: value })} />
          <Field label="Min." type="number" value={form.min_quantity} onChange={(value) => setForm({ ...form, min_quantity: value })} />
          <Field label="Preco" type="number" value={form.price} onChange={(value) => setForm({ ...form, price: value })} />
          <Field label="Categoria" type="number" value={form.category_id} onChange={(value) => setForm({ ...form, category_id: value })} />
          <Field label="Fornecedor" type="number" value={form.supplier_id} onChange={(value) => setForm({ ...form, supplier_id: value })} />
          <button className="primary-button compact" type="submit">
            <PackagePlus size={16} />
            Criar
          </button>
        </form>
      )}

      {loading ? (
        <LoadingState text="Carregando produtos..." />
      ) : (
        <ProductTable
          products={products}
          isAdmin={isAdmin}
          editingProductId={editingProductId}
          editForm={editForm}
          setEditForm={setEditForm}
          onEdit={startEdit}
          onCancel={cancelEdit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      )}
    </section>
  );
}

function Movements({ api, user }) {
  const [movements, setMovements] = useState([]);
  const [form, setForm] = useState({ ...initialMovementForm, user_id: user?.id || "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadMovements = async () => {
    setLoading(true);
    setError("");

    try {
      setMovements(await api("/movements"));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMovements();
  }, []);

  const handleCreate = async (event) => {
    event.preventDefault();

    try {
      await api("/movements", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          product_id: Number(form.product_id),
          user_id: Number(form.user_id),
          quantity: Number(form.quantity),
        }),
      });
      setForm({ ...initialMovementForm, user_id: user?.id || "" });
      await loadMovements();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="view">
      <ViewHeader
        title="Movimentacoes"
        action={
          <button className="secondary-button" type="button" onClick={loadMovements}>
            <RefreshCw size={16} />
            Atualizar
          </button>
        }
      />

      {error && <div className="error">{error}</div>}

      <form className="movement-form" onSubmit={handleCreate}>
        <Field label="Produto ID" type="number" value={form.product_id} onChange={(value) => setForm({ ...form, product_id: value })} />
        <Field label="Usuario ID" type="number" value={form.user_id} onChange={(value) => setForm({ ...form, user_id: value })} />
        <label>
          Tipo
          <select value={form.movement_type} onChange={(event) => setForm({ ...form, movement_type: event.target.value })}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saida</option>
          </select>
        </label>
        <Field label="Qtd." type="number" value={form.quantity} onChange={(value) => setForm({ ...form, quantity: value })} />
        <Field label="Observacao" value={form.observation} onChange={(value) => setForm({ ...form, observation: value })} />
        <button className="primary-button compact" type="submit">
          <ArrowDownUp size={16} />
          Registrar
        </button>
      </form>

      {loading ? (
        <LoadingState text="Carregando movimentacoes..." />
      ) : (
        <DataTable
          title="Historico"
          rows={movements}
          columns={[
            ["product_name", "Produto"],
            ["user_name", "Usuario"],
            ["movement_type", "Tipo"],
            ["quantity", "Qtd."],
            ["created_at", "Data", formatDate],
          ]}
        />
      )}
    </section>
  );
}

function ViewHeader({ title, action }) {
  return (
    <header className="view-header">
      <h2>{title}</h2>
      {action}
    </header>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label>
      {label}
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} required />
    </label>
  );
}

function ProductTable({
  products,
  isAdmin,
  editingProductId,
  editForm,
  setEditForm,
  onEdit,
  onCancel,
  onUpdate,
  onDelete,
}) {
  return (
    <section className="table-section">
      <h3>Lista de produtos</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>SKU</th>
              <th>Qtd.</th>
              <th>Min.</th>
              <th>Preco</th>
              <th>Categoria</th>
              <th>Fornecedor</th>
              {isAdmin && <th>Acoes</th>}
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 8 : 7}>Nenhum registro encontrado.</td>
              </tr>
            ) : (
              products.map((product) => {
                const isEditing = editingProductId === product.id;

                return (
                  <tr key={product.id}>
                    <EditableCell
                      isEditing={isEditing}
                      value={isEditing ? editForm.name : product.name}
                      onChange={(value) => setEditForm({ ...editForm, name: value })}
                    />
                    <EditableCell
                      isEditing={isEditing}
                      value={isEditing ? editForm.sku : product.sku}
                      onChange={(value) => setEditForm({ ...editForm, sku: value })}
                    />
                    <EditableCell
                      isEditing={isEditing}
                      type="number"
                      value={isEditing ? editForm.quantity : product.quantity}
                      onChange={(value) => setEditForm({ ...editForm, quantity: value })}
                    />
                    <EditableCell
                      isEditing={isEditing}
                      type="number"
                      value={isEditing ? editForm.min_quantity : product.min_quantity}
                      onChange={(value) => setEditForm({ ...editForm, min_quantity: value })}
                    />
                    <EditableCell
                      isEditing={isEditing}
                      type="number"
                      value={isEditing ? editForm.price : formatMoney(product.price)}
                      onChange={(value) => setEditForm({ ...editForm, price: value })}
                    />
                    <EditableCell
                      isEditing={isEditing}
                      type="number"
                      value={isEditing ? editForm.category_id : product.category_id}
                      onChange={(value) => setEditForm({ ...editForm, category_id: value })}
                    />
                    <EditableCell
                      isEditing={isEditing}
                      type="number"
                      value={isEditing ? editForm.supplier_id : product.supplier_id}
                      onChange={(value) => setEditForm({ ...editForm, supplier_id: value })}
                    />
                    {isAdmin && (
                      <td>
                        {isEditing ? (
                          <div className="row-actions">
                            <button className="icon-button light" type="button" title="Salvar" onClick={() => onUpdate(product.id)}>
                              <Check size={16} />
                            </button>
                            <button className="icon-button light" type="button" title="Cancelar" onClick={onCancel}>
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="row-actions">
                            <button className="icon-button light" type="button" title="Editar" onClick={() => onEdit(product)}>
                              <Pencil size={16} />
                            </button>
                            <button className="icon-button danger" type="button" title="Excluir" onClick={() => onDelete(product.id)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function EditableCell({ isEditing, value, onChange, type = "text" }) {
  return (
    <td>
      {isEditing ? (
        <input className="table-input" type={type} value={value} onChange={(event) => onChange(event.target.value)} />
      ) : (
        value
      )}
    </td>
  );
}

function DataTable({ title, rows = [], columns }) {
  return (
    <section className="table-section">
      <h3>{title}</h3>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map(([, label]) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length}>Nenhum registro encontrado.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  {columns.map(([key, label, formatter]) => (
                    <td key={`${row.id}-${label}`}>{formatter ? formatter(row[key]) : row[key]}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function LoadingState({ text }) {
  return <div className="state">{text}</div>;
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="state error-state">
      <p>{error}</p>
      <button className="secondary-button" type="button" onClick={onRetry}>
        <RefreshCw size={16} />
        Tentar novamente
      </button>
    </div>
  );
}

function formatMoney(value) {
  return Number(value || 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Date(value).toLocaleString("pt-BR");
}

createRoot(document.getElementById("root")).render(<App />);

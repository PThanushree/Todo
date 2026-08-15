import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api.js";

export default function TodoScreen() {
  const { token, user, logout } = useAuth();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getTodos(token)
      .then((data) => {
        if (!cancelled) setTodos(data);
      })
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [token]);

  async function handleAdd(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    setTitle("");
    try {
      const created = await createTodo(token, trimmed);
      setTodos((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleToggle(todo) {
    // optimistic update
    setTodos((prev) =>
      prev.map((t) => (t._id === todo._id ? { ...t, completed: !t.completed } : t))
    );
    try {
      await updateTodo(token, todo._id, { completed: !todo.completed });
    } catch (err) {
      setError(err.message);
      setTodos((prev) =>
        prev.map((t) => (t._id === todo._id ? { ...t, completed: todo.completed } : t))
      );
    }
  }

  async function handleDelete(id) {
    const prevTodos = todos;
    setTodos((prev) => prev.filter((t) => t._id !== id));
    try {
      await deleteTodo(token, id);
    } catch (err) {
      setError(err.message);
      setTodos(prevTodos);
    }
  }

  const remaining = todos.filter((t) => !t.completed).length;
  const serial = String(todos.length).padStart(3, "0");

  return (
    <div className="ticket-screen">
      <header className="ticket-header">
        <div>
          <p className="eyebrow">Ledger of {user?.username}</p>
          <h1 className="title">Tasks</h1>
        </div>
        <div className="header-right">
          <span className="serial">No. {serial}</span>
          <button className="btn-ghost" onClick={logout}>
            Sign out
          </button>
        </div>
      </header>

      <form className="stub-form" onSubmit={handleAdd}>
        <input
          className="stub-input"
          placeholder="Write a new task…"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Add
        </button>
      </form>

      <div className="perforation" aria-hidden="true" />

      {error && <p className="auth-error list-error">{error}</p>}

      {loading ? (
        <p className="empty-state">Opening the ledger…</p>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <p className="empty-title">Nothing on the books.</p>
          <p>Add a task above to start your first entry.</p>
        </div>
      ) : (
        <ul className="ticket-list">
          {todos.map((todo, i) => (
            <li key={todo._id} className={`ticket-row ${todo.completed ? "is-done" : ""}`}>
              <button
                className="stamp-box"
                onClick={() => handleToggle(todo)}
                aria-pressed={todo.completed}
                aria-label={todo.completed ? "Mark as not done" : "Mark as done"}
              >
                {todo.completed && <span className="stamp-mark">DONE</span>}
              </button>
              <span className="ticket-index">{String(todos.length - i).padStart(2, "0")}</span>
              <span className="ticket-title">{todo.title}</span>
              <button
                className="btn-void"
                onClick={() => handleDelete(todo._id)}
                aria-label="Delete task"
              >
                Void
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="ticket-footer">
        <span>
          {remaining} of {todos.length} outstanding
        </span>
      </footer>
    </div>
  );
}

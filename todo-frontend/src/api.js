const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(path, token, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...options,
  });
  const body = await res.json();
  if (!body.success) {
    throw new Error(body.message || "Request failed");
  }
  return body.data;
}

export function getTodos(token) {
  return request("/todos", token);
}

export function createTodo(token, title) {
  return request("/create-todo", token, {
    method: "POST",
    body: JSON.stringify({ title, completed: false }),
  });
}

export function updateTodo(token, id, updates) {
  return request(`/${id}`, token, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function deleteTodo(token, id) {
  return request(`/delete/${id}`, token, {
    method: "DELETE",
  });
}

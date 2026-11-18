const BASE = '/api/todos';

// One helper that every call goes through
async function request(url, options) {
  const res = await fetch(url, options);

  if (!res.ok) {
    let message = 'Something went wrong';
    try {
      const err = await res.json();
      // Matches your GlobalExceptionHandler: either "errors" or "detail"
      message = err.errors ? Object.values(err.errors).join(', ') : err.detail || message;
    } catch {
      // response had no JSON body
    }
    throw new Error(message);
  }

  if (res.status === 204) return null; // DELETE returns No Content
  return res.json();
}

const jsonHeaders = { 'Content-Type': 'application/json' };

// READ
export function getTodos() {
  return request(`${BASE}?size=100&sort=createdAt,desc`).then((page) => page.content);
}

// CREATE
export function createTodo(todo) {
  return request(BASE, {
    method: 'POST',
    headers: jsonHeaders,
    body: JSON.stringify(todo),
  });
}

// UPDATE (edit fields)
export function updateTodo(id, todo) {
  return request(`${BASE}/${id}`, {
    method: 'PUT',
    headers: jsonHeaders,
    body: JSON.stringify(todo),
  });
}

// UPDATE (mark done / not done)
export function toggleTodo(id) {
  return request(`${BASE}/${id}/toggle`, { method: 'PATCH' });
}

// DELETE
export function deleteTodo(id) {
  return request(`${BASE}/${id}`, { method: 'DELETE' });
}
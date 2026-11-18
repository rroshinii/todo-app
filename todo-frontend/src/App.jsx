import { useState, useEffect } from 'react';
import { getTodos, createTodo, updateTodo, toggleTodo, deleteTodo } from './api';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';

function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Reload the list from the server
  async function refresh() {
    setTodos(await getTodos());
  }

  // Runs once when the page first loads (the [] means "only once")
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // CREATE: errors are thrown back to the form, which displays them
  async function handleCreate(data) {
    await createTodo(data);
    await refresh();
  }

  // UPDATE: same pattern
  async function handleUpdate(id, data) {
    await updateTodo(id, data);
    await refresh();
  }

  async function handleToggle(id) {
    try {
      await toggleTodo(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  // DELETE
  async function handleDelete(todo) {
    if (!window.confirm(`Delete "${todo.title}"?`)) return;
    try {
      await deleteTodo(todo.id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="app">
      <h1>To-Do</h1>

      <TodoForm onSubmit={handleCreate} submitLabel="Add" />

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p className="empty">Loading…</p>
      ) : todos.length === 0 ? (
        <p className="empty">Nothing here yet.</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
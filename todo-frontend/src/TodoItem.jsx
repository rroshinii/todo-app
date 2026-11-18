import { useState } from 'react';
import TodoForm from './TodoForm';

function TodoItem({ todo, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);

  const today = new Date().toLocaleDateString('en-CA'); // yyyy-MM-dd
  const overdue = !todo.completed && todo.dueDate && todo.dueDate < today;

  // Edit mode: show the form instead of the normal row
  if (editing) {
    return (
      <li className="editing">
        <TodoForm
          initial={todo}
          submitLabel="Save"
          onSubmit={async (data) => {
            await onUpdate(todo.id, data);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      </li>
    );
  }

  // Normal mode
  return (
    <li className={todo.completed ? 'done' : ''}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <div className="body">
        <div className="title">
          {todo.title}
          <span className={`badge ${todo.priority}`}>{todo.priority}</span>
        </div>
        {todo.description && <div className="desc">{todo.description}</div>}
        {todo.dueDate && (
          <div className={overdue ? 'due overdue' : 'due'}>
            {overdue ? 'Overdue: ' : 'Due: '}
            {todo.dueDate}
          </div>
        )}
      </div>
      <button className="link" onClick={() => setEditing(true)}>Edit</button>
      <button className="link del" onClick={() => onDelete(todo)}>✕</button>
    </li>
  );
}

export default TodoItem;
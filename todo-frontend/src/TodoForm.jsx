import { useState } from 'react';

function TodoForm({ initial, onSubmit, onCancel, submitLabel = 'Add' }) {
  // One piece of state per input. Edit mode starts with the todo's values.
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [priority, setPriority] = useState(initial?.priority ?? 'MEDIUM');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault(); // stop the browser's default page reload
    setError('');
    try {
      await onSubmit({
        title,
        description: description || null, // empty string -> null, like your old page
        priority,
        dueDate: dueDate || null,
      });
      if (!initial) {
        // after adding, clear the form
        setTitle('');
        setDescription('');
        setPriority('MEDIUM');
        setDueDate('');
      }
    } catch (err) {
      setError(err.message); // e.g. "Title is required"
    }
  }

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs doing?"
        maxLength={200}
      />
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        maxLength={1000}
      />
      <div className="row">
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

export default TodoForm;
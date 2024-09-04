import React from 'react';
import useTodos from '../../../hooks/useTodos';
import TodoInput from '../TodoInput/TodoInput';
import TodoItem from '../TodoItem/TodoItem';

const TodoList: React.FC = () => {
  const {
    todos,
    editing,
    addTodo,
    removeTodo,
    startEditing,
    submitEdit,
    setEditing,
  } = useTodos();

  return (
    <div>
      <h1>Todo List</h1>
      <TodoInput onAdd={addTodo} />
      <ul>
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            isEditing={editing.id === todo.id}
            editingText={editing.text}
            onEdit={startEditing}
            onRemove={removeTodo}
            onSave={() => submitEdit(todo.id)}
            onCancel={() => setEditing({ id: null, text: '' })}
            onChange={(text) => setEditing({ ...editing, text })}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
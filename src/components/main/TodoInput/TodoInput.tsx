import React, { useState } from 'react';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [newTodo, setNewTodo] = useState<string>('');

  const handleAdd = () => {
    onAdd(newTodo);
    setNewTodo('');
  };

  return (
    <div>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={handleAdd}>Add</button>
    </div>
  );
};

export default TodoInput;
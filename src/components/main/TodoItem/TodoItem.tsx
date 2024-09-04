import React from 'react';

interface TodoItemProps {
  id: number;
  text: string;
  isEditing: boolean;
  editingText: string;
  onEdit: (id: number, text: string) => void;
  onRemove: (id: number) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onChange: (text: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  isEditing,
  editingText,
  onEdit,
  onRemove,
  onSave,
  onCancel,
  onChange,
}) => {
  return (
    <li>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editingText}
            onChange={(e) => onChange(e.target.value)}
          />
          <button onClick={() => onSave(id)}>Save</button>
          <button onClick={onCancel}>Cancel</button>
        </>
      ) : (
        <>
          {text}
          <button onClick={() => onEdit(id, text)}>Edit</button>
          <button onClick={() => onRemove(id)}>Remove</button>
        </>
      )}
    </li>
  );
};

export default TodoItem;
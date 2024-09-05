import React from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Check, Edit2, Trash2 } from "lucide-react"
import TodoItemStyledComponent from './TodoItemStyledComponent';

interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
  isEditing: boolean;
  editingText: string;
  onEdit: (id: number, text: string) => void;
  onRemove: (id: number) => void;
  onSave: (id: number) => void;
  onCancel: () => void;
  onChange: (text: string) => void;
  onToggle: (id: number) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  isEditing,
  editingText,
  onEdit,
  onRemove,
  onSave,
  onCancel,
  onChange,
  onToggle,
}) => {
  return (
    <TodoItemStyledComponent className="flex flex-grow items-center bg-gray-100 p-3 rounded-md ">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="mr-2"
      />
      {isEditing ? (
        <>
          <Input
            type="text"
            value={editingText}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onSave(id);
              if (e.key === 'Escape') onCancel();
            }}
            className="flex-grow mr-2 bg-white text-gray-800"
          />
          <Button variant="ghost" size="icon" onClick={() => onSave(id)}>
            <Check className="h-5 w-5 text-green-500" />
          </Button>
        </>
      ) : (
        <>
          <span className={`flex-grow ${completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
            {text}
          </span>
          <Button variant="ghost" size="icon" onClick={() => onEdit(id, text)} className="mr-2">
            <Edit2 className="h-5 w-5 text-gray-500" />
          </Button>
        </>
      )}
      <Button variant="ghost" size="icon" onClick={() => onRemove(id)}>
        <Trash2 className="h-5 w-5 text-red-500" />
      </Button>
    </TodoItemStyledComponent>
  );
};

export default TodoItem;
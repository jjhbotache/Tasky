import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, Edit2, Trash2 } from "lucide-react";
import TodoItemStyledComponent from './TodoItemStyledComponent';

interface TodoItemProps {
  id: number;
  text: string;
  completed: boolean;
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
  onEdit,
  onRemove,
  onSave,
  onCancel,
  onChange,
  onToggle,
}) => {
  return (
    <TodoItemStyledComponent className="flex flex-grow items-center bg-gray-100 p-3 rounded-md gap-2">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="mr-2"
      />
      <div className="flex flex-col w-full">
        {/* show the name and date */}
        <span className={`text-lg ${completed ? 'line-through' : ''}`}>{text}</span>
        <span className="text -sm text-gray-500">Due date: {new Date().toLocaleDateString()}</span>
      </div>
      <Button variant="ghost" size="icon" onClick={() => onEdit(id, text)} className="animatedBtn">
        <Edit2 className="h-5 w-5 text-gray-500" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onRemove(id)} className='animatedBtn'>
        <Trash2 className="h-5 w-5 text-red-500" />
      </Button>
    </TodoItemStyledComponent>
  );
};

export default TodoItem;
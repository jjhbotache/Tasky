import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import TodoInputStyledComponent from './TodoInputStyledComponent';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [newTodo, setNewTodo] = useState<string>('');

  const handleAdd = () => {
    if (newTodo.trim() !== '') {
      onAdd(newTodo);
      setNewTodo('');
    }
  };

  return (
    <TodoInputStyledComponent className="flex mb-4">
      <Input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyUpCapture={(e) => e.key === 'Enter' && handleAdd()}
        placeholder="Add a new todo"
        className="flex-grow mr-2 bg-gray-100  text-gray-800 rounded-lg focus-visible:outline-none"
      />
      <Button onClick={handleAdd} className="bg-gray-800 text-white hover:bg-gray-700 rounded-lg addBtn">
        <PlusCircle className="h-5 w-5 mr-2" />
        Add
      </Button>
    </TodoInputStyledComponent>
  );
};

export default TodoInput;
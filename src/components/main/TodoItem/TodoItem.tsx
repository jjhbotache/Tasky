import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2 } from "lucide-react";
import TodoItemStyledComponent from './TodoItemStyledComponent';
import useTodos from '@/hooks/useTodos';

interface TodoItemProps {
  id: number;
  onEdit: (id: number, text: string, dueDate: string) => void;
}

function TodoItem({ id, onEdit }: TodoItemProps){
  const {tasks, updateTodo, removeTodo } = useTodos();
  const task = tasks.find(task => task.id === id);
  if (!task)return null;


  const { text, completed, dueDate } = task;

  const onToggle = (id: number) => {
    updateTodo(id, text, dueDate, !completed);
  };

  const onRemove = (id: number) => {
    removeTodo(id);
  };

  return (
    <TodoItemStyledComponent className="flex flex-grow items-center bg-gray-100 p-3 rounded-md gap-2">
      <Checkbox
        checked={completed}
        onCheckedChange={() => onToggle(id)}
        className="mr-2"
      />
      <div className="flex flex-col w-full">
        <span className={`text-lg ${completed ? 'line-through' : ''}`}>{text}</span>
        <Input
          type="date"
          value={dueDate}
          className="mt-2"
          disabled={true}
        />
      </div>
      <Button variant="ghost" size="icon" onClick={() => onEdit(id, text, dueDate)} className="animatedBtn">
        <Edit2 className="h-5 w-5 text-gray-500" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onRemove(id)} className='animatedBtn'>
        <Trash2 className="h-5 w-5 text-red-500" />
      </Button>
    </TodoItemStyledComponent>
  );
};

export default TodoItem;
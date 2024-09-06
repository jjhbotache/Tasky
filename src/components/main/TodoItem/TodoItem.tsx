import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit2, Trash2 } from "lucide-react";
import TodoItemStyledComponent from './TodoItemStyledComponent';
import useTodos from '@/hooks/useTodos';
import { toast } from "react-toastify";

interface TodoItemProps {
  id: number;
  onEdit: (id: number) => void;
}

function TodoItem({ id, onEdit }: TodoItemProps){
  const {tasks, updateTodo, removeTodo } = useTodos();
  const task = tasks.find(task => task.id === id);
  if (!task)return null;


  const { text, completed, dueDate, image} = task;

  const onToggle = (id: number) => {
    updateTodo(id, text, dueDate, !completed, image);  
  };

  const onRemove = (id: number) => {
    removeTodo(id);
    toast.info('Task removed');
  };

  return (
    <TodoItemStyledComponent className="flex flex-grow items-center bg-gray-100 p-3 rounded-md gap-2 flex-wrap w-full relative overflow-hidden">
      {
        !!image &&  <div className="bgImgContainer">
          <img src={image} alt="task image"/>
        </div>
      }
      <div className="z-10 w-full">
        <div className="flex w-full justify-start items-center">
          <Checkbox
            checked={completed}
            onCheckedChange={() => onToggle(id)}
            className="mr-2"
          />
          <span className={`text-lg  ${completed ? 'line-through' : ''}  truncate`}>{text}</span>
        </div>
        {/* date */}
        <div className="flex flex-col w-full">
          <Input
            type="date"
            value={dueDate}
            className="mt-2 bg-slate-100"
            onClick={(e) => {
              e.preventDefault();
              onEdit(id);

            }}
          />
        </div>
        {/* btns */}
        <div className="flex w-full justify-end">
          <Button variant="ghost" size="icon" onClick={() => onEdit(id)} className="animatedBtn">
            <Edit2 className="h-5 w-5 text-gray-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => onRemove(id)} className='animatedBtn'>
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button>
        </div>
      </div>
    </TodoItemStyledComponent>
  );
};

export default TodoItem;
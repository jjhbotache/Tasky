import { TodoContext } from '@/App';
import { useState, useEffect, useContext } from 'react';

export interface PseudoTodo {
  id: number | null;
  text: string;
  completed: boolean;
  dueDate: string;
}

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
}


function useTodos (){
  const [] = useState<Todo[]>([]);
  const {tasks, setTasks} = useContext(TodoContext);

  useEffect(() => {
    const savedTodos = sessionStorage.getItem('todos');
    if (savedTodos) {
      setTasks(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('todos', JSON.stringify(tasks));

  }, [tasks]);

  const addTodo = (name: string, dueDate: string) => {
    const newTodoItem: Todo = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      text: name.trim(),
      dueDate: dueDate,
      completed: false,
    }
    setTasks([...tasks, newTodoItem]);
  };

  const removeTodo = (id: number) => {
    setTasks(tasks.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: number, text: string, dueDate: string, completed:boolean) => {
    setTasks(tasks.map(todo => todo.id === id ? {
      ...todo,
      text: text.trim(),
      dueDate,
      completed
    } : todo));
  }


  // more functions 

  function getTodo(id:number): Todo | PseudoTodo {
    return tasks.find(todo => todo.id === id) || { id: null, text: '', completed: false, dueDate: '' };
  }


  return {
    //Crud
    addTodo,
    tasks, 
    updateTodo,
    removeTodo,

    // more functions
    getTodo
  };
};

export default useTodos;
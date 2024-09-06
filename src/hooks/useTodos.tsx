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
      console.log("saving tasks from on mount useTodos useEffect", JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    // sync

    if (tasks.length === 0) {
      sessionStorage.removeItem('todos');
      console.log('removed todos');
      return;
    }else{
      // if are different (sessionStorage and tasks)
      if (JSON.stringify(tasks) === sessionStorage.getItem('todos')) {
        console.log('no need to save todos, are the same');
        return;
      }else{
        sessionStorage.setItem('todos', JSON.stringify(tasks));
        console.log('saved todos', tasks);
      }

    }
    
    // console.log('saved todos', tasks);    
  }, [tasks]);

  const addTodo = (name: string, dueDate: string) => {
    const newTodoItem: Todo = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      text: name.trim(),
      dueDate: dueDate,
      completed: false,
    }
    setTasks([...tasks, newTodoItem]);
    console.log('added todo', newTodoItem);
    
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
import { TodoContext } from '@/App'; 
import { useEffect, useContext } from 'react'; 


export interface PseudoTodo {
  id: number | null;
  text: string;
  completed: boolean;
  dueDate: string;
  image: string;
}


export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string;
  image: string;
}

function useTodos() {
  const { tasks, setTasks } = useContext(TodoContext); 

  useEffect(() => {
    const savedTodos = sessionStorage.getItem('todos'); // Get saved todos from sessionStorage
    if (savedTodos) {
      setTasks(JSON.parse(savedTodos)); // Parse and set tasks if savedTodos exists
    }
  }, []); // Run this effect only once when the component mounts

  useEffect(() => {
    if (tasks.length === 0) {
      sessionStorage.removeItem('todos'); // Remove todos from sessionStorage if tasks are empty
      return;
    } else {
      if (JSON.stringify(tasks) === sessionStorage.getItem('todos')) {
        return; // Do nothing if tasks haven't changed
      } else {
        sessionStorage.setItem('todos', JSON.stringify(tasks)); // Save tasks to sessionStorage if they have changed
      }
    }
  }, [tasks]); // Run this effect whenever tasks change

  const addTodo = (name: string, dueDate: string, image: string) => {
    const newTodoItem: Todo = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1, 
      text: name.trim(), 
      dueDate: dueDate, 
      completed: false, 
      image: image 
    };
    setTasks([...tasks, newTodoItem]); // Add the new todo to the tasks
  };

  const removeTodo = (id: number) => {
    setTasks(tasks.filter(todo => todo.id !== id)); // Remove the todo with the given id
  };

  const updateTodo = (id: number, text: string, dueDate: string, completed: boolean, image: string) => {
    setTasks(tasks.map(todo => todo.id === id ? {
      ...todo,
      text: text.trim(), 
      dueDate, 
      completed, 
      image 
    } : todo)); 
  };

  function getTodo(id: number): Todo | PseudoTodo {
    return tasks.find(todo => todo.id === id) || { id: null, text: '', completed: false, dueDate: '', image: '' }; // Return the todo with the given id or a default PseudoTodo
  }

  return {
    addTodo, 
    tasks, 
    updateTodo, 
    removeTodo, 
    getTodo 
  };
}

export default useTodos; 
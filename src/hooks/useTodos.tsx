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
    const savedTodos = sessionStorage.getItem('todos');
    if (savedTodos) {
      setTasks(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    if (tasks.length === 0) {
      sessionStorage.removeItem('todos');
      return;
    } else {
      if (JSON.stringify(tasks) === sessionStorage.getItem('todos')) {
        return;
      } else {
        sessionStorage.setItem('todos', JSON.stringify(tasks));
      }
    }
  }, [tasks]);

  const addTodo = (name: string, dueDate: string, image: string) => {
    const newTodoItem: Todo = {
      id: tasks.length ? tasks[tasks.length - 1].id + 1 : 1,
      text: name.trim(),
      dueDate: dueDate,
      completed: false,
      image: image
    };
    setTasks([...tasks, newTodoItem]);
  };

  const removeTodo = (id: number) => {
    setTasks(tasks.filter(todo => todo.id !== id));
  };

  const updateTodo = (id: number, text: string, dueDate: string, completed: boolean, image: string) => {
    setTasks(tasks.map(todo => todo.id === id ? {
      ...todo,
      text: text.trim(),
      dueDate,
      completed,
      image // Actualizar la imagen del todo
    } : todo));
  };

  function getTodo(id: number): Todo | PseudoTodo {
    return tasks.find(todo => todo.id === id) || { id: null, text: '', completed: false, dueDate: '', image: '' };
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
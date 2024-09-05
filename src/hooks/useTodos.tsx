import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  dueDate: string; // Añadir la propiedad dueDate
}

interface EditingState {
  id: number | null;
  text: string;
  dueDate: string; // Añadir la propiedad dueDate
}

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editing, setEditing] = useState<EditingState>({ id: null, text: '', dueDate: '' });

  useEffect(() => {
    const savedTodos = sessionStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    if (text.trim() === '') return;
    const newTodoItem: Todo = { id: Date.now(), text, completed: false, dueDate: '' }; // Inicializar dueDate en ''
    setTodos([...todos, newTodoItem]);
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: number, text: string, dueDate: string) => {
    setEditing({ id, text, dueDate });
  };

  const submitEdit = (id: number) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, text: editing.text, dueDate: editing.dueDate } : todo)));
    setEditing({ id: null, text: '', dueDate: '' });
  };

  const toggleComplete = (id: number) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  return {
    todos,
    editing,
    addTodo,
    removeTodo,
    startEditing,
    submitEdit,
    setEditing,
    toggleComplete, // Añadir toggleComplete al objeto retornado
  };
};

export default useTodos;
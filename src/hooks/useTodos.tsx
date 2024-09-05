import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface EditingState {
  id: number | null;
  text: string;
}

const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editing, setEditing] = useState<EditingState>({ id: null, text: '' });

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
    const newTodoItem: Todo = { id: Date.now(), text, completed: false }; // Inicializar completed en false
    setTodos([...todos, newTodoItem]);
  };

  const removeTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditing({ id, text });
  };

  const submitEdit = (id: number) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, text: editing.text } : todo)));
    setEditing({ id: null, text: '' });
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
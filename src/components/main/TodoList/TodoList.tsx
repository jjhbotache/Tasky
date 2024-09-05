import React from 'react';
import useTodos from '../../../hooks/useTodos';
import TodoInput from '../TodoInput/TodoInput';
import TodoItem from '../TodoItem/TodoItem';
import { motion, AnimatePresence } from 'framer-motion';
import TodoListStyledComponent from './TodoStyledComponent';

const TodoList: React.FC = () => {
  const {
    todos,
    editing,
    addTodo,
    removeTodo,
    startEditing,
    submitEdit,
    setEditing,
    toggleComplete,
  } = useTodos();

  return (
    <TodoListStyledComponent 
      className="max-w-md w-full mx-auto pb-4 bg-white rounded-xl shadow-lg relative scr"
      animate={{
        height: todos.length > 0 ? "85vh" : "",
        transition: { duration: 0.6, ease: "easeInOut" },
      }}
      >
      <div className="header
      px-4 pb-1
      sticky top-0 bg-primary backdrop-blur-10 pt-2
      ">
        <h1 className="text-3xl font-bold mb-6 text-center">Cool Todo List</h1>
        <TodoInput onAdd={addTodo} />
      </div>
      <ul className='flex flex-col gap-2 px-4'>
        <AnimatePresence>
          {todos.map(todo => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex items-center bg-gray-100 p-3 rounded-md"
            >
              <TodoItem
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                isEditing={editing.id === todo.id}
                editingText={editing.text}
                onEdit={startEditing}
                onRemove={removeTodo}
                onSave={() => submitEdit(todo.id)}
                onCancel={() => setEditing({ id: null, text: '' })}
                onChange={(text) => setEditing({ ...editing, text })}
                onToggle={() => toggleComplete(todo.id)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {todos.length === 0 && (
        <p className="text-center text-gray-700 mt-4">No todos yet. Add one above!</p>
      )}
    </TodoListStyledComponent>
  );
};

export default TodoList;
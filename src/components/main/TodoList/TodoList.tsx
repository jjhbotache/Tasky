import React from 'react';
import useTodos from '../../../hooks/useTodos';
import TodoInput from '../TodoInput/TodoInput';
import TodoItem from '../TodoItem/TodoItem';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import TodoListStyledComponent from './TodoStyledComponent';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

  const imgControls = useAnimation();

  const handleAddTodo = (text: string) => {
    toast.dismiss();
    if (!text) {
      toast.error('Please enter a todo!');
      return;
    }
    addTodo(text);
    toast.success('Todo added successfully!');
    imgControls.start({
      rotateY: 360,
      transition: { duration: 0.6, ease: "easeInOut" },
    }).then(() => {
      imgControls.set({ rotateY: 0 });
    });
    

  };

  const handleRemoveTodo = (id: number) => {
    toast.dismiss();
    removeTodo(id);
    toast.info('Todo removed.');
  };

  const handleSubmitEdit = (id: number) => {
    toast.dismiss();
    submitEdit(id);
    toast.success('Todo updated successfully!');
  };

  const handleToggleComplete = (id: number) => {
    toast.dismiss();
    toggleComplete(id);
    toast.success('Todo status updated!');
  };

  return (
    <TodoListStyledComponent 
      className="max-w-md w-full mx-auto bg-white rounded-xl shadow-lg gap-2"
      animate={{
        height: todos.length > 0 ? "85vh" : "250px",
        transition: { duration: 0.6, ease: "easeInOut" },
      }}
      >
      <ToastContainer />
      <div className="header
      px-4 pb-1
      sticky top-0 bg-primary backdrop-blur-10 pt-2
      ">
        <div className="flex flex-row justify-center gap-2">
          <h1 className="text-3xl font-bold mb-6 text-center">Tasky</h1>
          <motion.img 
            src="tasky.svg" 
            className='h-10'
            animate={imgControls}
            initial={{ rotateY: 0 }}
          />
        </div>
        <TodoInput onAdd={handleAddTodo} />
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
                onRemove={() => handleRemoveTodo(todo.id)}
                onSave={() => handleSubmitEdit(todo.id)}
                onCancel={() => setEditing({ id: null, text: '' })}
                onChange={(text) => setEditing({ ...editing, text })}
                onToggle={() => handleToggleComplete(todo.id)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {todos.length === 0 && (
        <p className="text-center text-gray-700">No todos yet. Add one above!</p>
      )}
    </TodoListStyledComponent>
  );
};

export default TodoList;
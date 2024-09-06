import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import TodoListStyledComponent from './TodoListStyledComponent'
import TodoItem from '../TodoItem/TodoItem'
import TaskEditor from '../TaskEditor/TaskEditor'
import { useContext, useState } from 'react'
import { TodoContext } from '@/App'
import { Todo } from '@/hooks/useTodos'

export default function TodoList() {
  const { tasks } = useContext(TodoContext)
  const [onEditorTask, setOnEditorTask] = useState< undefined |null | number>() // undefined is for close, null is for add, number is for edit
  

  
  
  return (
    <TodoListStyledComponent 
      className="w-full max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
      animate={{
        height: tasks.length > 0 ? "95vh" : "auto",
        transition: { duration: 0.5, ease: "easeInOut" }
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Tasky</h1>
      <motion.div
        className="overflow-y-auto"
        animate={{
          height: tasks.length > 0 ? "calc(95vh - 180px)" : "auto",
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        <AnimatePresence>
          {tasks.map((task:Todo, index:number) => (
            <motion.li
              key={task.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 }
              }}
              exit={{ opacity: 0, y: -10 }}
              layout
              className="flex items-center bg-gray-100 dark:bg-gray-700 p-3 rounded-md mb-2"
            >
              <TodoItem
                key={task.id}
                id={task.id}
                onEdit={()=>{
                  console.log('setting to editor', task.id);
                  
                  setOnEditorTask(task.id)
                }}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.div>
      {tasks.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No tasks yet. Add one with the button below!</p>
      )}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 addBtn"
        onClick={() => setOnEditorTask(null)}
      >
        <PlusCircle className="h-6 w-6" />
      </Button>

      <TaskEditor
        isModalOpen={onEditorTask!==undefined}
        onClose={() => setOnEditorTask(undefined)}
        taskId={onEditorTask || null}
      />
    </TodoListStyledComponent>
  )
}
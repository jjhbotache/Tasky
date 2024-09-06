import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import TodoListStyledComponent from './TodoListStyledComponent'
import TodoItem from '../TodoItem/TodoItem'
import TaskEditor from '../TaskEditor/TaskEditor'
import { useContext, useEffect, useState } from 'react'
import { TodoContext } from '@/App'
import { Todo } from '@/hooks/useTodos'

export default function TodoList() {
  const { tasks } = useContext(TodoContext)
  const [onEditorTask, setOnEditorTask] = useState< undefined | null | number>() 
  const logoControls = useAnimationControls()
  
  // Effect to animate the logo when tasks change
  useEffect(() => {
    logoControls.start({
      rotateY: 360,
      transition: { duration: 1, ease: "easeInOut" }
    }).then(() => {
      logoControls.set({
        rotateY: 0,
      })
    })
  }, [tasks])
  
  return (
    <TodoListStyledComponent  animate={{height: tasks.length > 0 ? "90vh" : "150px",}} transition={{ duration: .5, ease:"easeInOut" }} >
      <div className="w-full p-4">
      {/* Header */}
      <div className="flex w-full justify-center gap-4">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 ">Tasky</h1>
        <motion.img
          animate={logoControls}
          src="tasky.svg" alt="tasky logo"
          className='h-10 w-10'
        >
        </motion.img>
      </div>
      {/* Tasks */}
      <AnimatePresence>
        {tasks
        .sort((a, b) => a.completed ? 1 : -1) // Sort tasks by completion status
        .map((task:Todo, index:number) => (
          <motion.li
            key={task.id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 } // Staggered animation
            }}
            exit={{ opacity: 0, y: -10 }}
            layout
            className="flex items-center bg-gray-100  p-3 rounded-md mb-2 overflow-hidden"
          >
            <TodoItem
              key={task.id}
              id={task.id}
              onEdit={()=>{
                setOnEditorTask(task.id) // Set the task to be edited
              }}
            />
          </motion.li>
        ))}
      </AnimatePresence>
      {tasks.length === 0 && <p className="text-center text-gray-600 mt-4">No tasks yet. Add one with the button below!</p>}

      {/* add task btn */}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 addBtn z-20"
        onClick={() => setOnEditorTask(null)} // Open the TaskEditor to add a new task
      >
        <PlusCircle className="h-6 w-6" />
      </Button>

      <TaskEditor
        isModalOpen={onEditorTask!==undefined} // Open the modal if a task is being edited or added
        onClose={() => setOnEditorTask(undefined)} // Close the modal
        taskId={onEditorTask || null} // Pass the task ID to the TaskEditor
      />
      </div>
    </TodoListStyledComponent>
  )
}
import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Trash2, Edit2, Check, Calendar } from "lucide-react"
import TaskListStyledComponent from './TodoListStyledComponent'
import useGemini from '@/hooks/useGemini'
import useDebounce from '@/hooks/useDebounce'
import levensteinDistance from '@/helpers/levensteinDistance'
import TaskEditor from '@/components/main/TaskEditor/TaskEditor'

interface Task {
  id: number
  text: string
  completed: boolean
  dueDate: string
}

export default function TaskList() {
  const [Tasks, setTasks] = useState<Task[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTask, setNewTask] = useState('')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [bestSuggestion, setBestSuggestion] = useState('')
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const { getSuggestions } = useGemini()

  const inputRef = useRef<HTMLInputElement>(null)
  const imgControls = useAnimation();

  useEffect(() => {
    setTasks(Tasks.sort((a, b) => Number(a.completed) - Number(b.completed)))
  }, [Tasks])

  const debouncedGetSuggestions = useDebounce(async (text: string) => {
    const suggestions = await getSuggestions(text)
    if (text.length > 0 && suggestions.length > 0) {
      const filtered = suggestions.filter(
        suggestion => suggestion.toLowerCase().startsWith(text.toLowerCase())
      )
      
      const shortestDistance = filtered.sort((a, b) => levensteinDistance(text, a) - levensteinDistance(text, b))
      setSuggestions(filtered)
      console.log(filtered);
      
      if (shortestDistance.length > 0) {
        setSuggestionIndex(0)
        setBestSuggestion(shortestDistance[0])
      } 
    } else {
      setBestSuggestion('')
      setSuggestions([])
    }
  }, 300)

  useEffect(() => {
    if (newTask.trim() === '') {
      setSuggestions([])
      setBestSuggestion('')
    }else if (newTask.trim().length > 4 ) {
      setSuggestionIndex(0)
      debouncedGetSuggestions(newTask)
    }
  }, [newTask])

  const addTask = () => {
    if (newTask.trim() !== '') {
      setTasks([...Tasks, { id: Date.now(), text: newTask, completed: false, dueDate: newTaskDueDate }])
      setNewTask('')
      setNewTaskDueDate('')
      setBestSuggestion('')
      setIsModalOpen(false)
    }
    imgControls.start({
      rotateY: 360,
      transition: { duration: 0.6, ease: "easeInOut" },
    }).then(() => {
      imgControls.set({ rotateY: 0 });
    });
  }

  const toggleTask = (id: number) => {
    setTasks(Tasks.map(Task =>
      Task.id === id ? { ...Task, completed: !Task.completed } : Task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(Tasks.filter(Task => Task.id !== id))
  }

  const startEditing = (id: number, text: string) => {
    setEditingId(id)
    setEditText(text)
  }

  const saveEdit = () => {
    if (editingId !== null) {
      setTasks(Tasks.map(Task =>
        Task.id === editingId ? { ...Task, text: editText } : Task
      ))
      setEditingId(null)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowRight' && bestSuggestion) {
      e.preventDefault()
      setNewTask(bestSuggestion)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      changeSuggestion(-1)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      changeSuggestion(1)
    }
  }

  const handleWheel = (e: React.WheelEvent<HTMLInputElement>) => {
    if (e.deltaY < 0) {
      changeSuggestion(-1)
    } else if (e.deltaY > 0) {
      changeSuggestion(1)
    }
  }

  const changeSuggestion = (direction: number) => {
    const newIndex = (suggestionIndex + direction + suggestions.length) % suggestions.length
    setSuggestionIndex(newIndex)
    setBestSuggestion(suggestions[newIndex])
  }

  const handleSuggestionClick = () => {
    if (inputRef?.current?.focus)setNewTask(bestSuggestion)
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <TaskListStyledComponent 
      className="w-full max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
      animate={{
        height: Tasks.length > 0 ? "95vh" : "auto",
        transition: { duration: 0.5, ease: "easeInOut" }
      }}
    >
      <div className="flex w-full justify-center gap-2">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Tasky</h1>
        <motion.img 
            src="tasky.svg" 
            className='h-10'
            animate={imgControls}
            initial={{ rotateY: 0 }}
          />
      </div>
      <motion.div
        className="overflow-y-auto"
        animate={{
          height: Tasks.length > 0 ? "calc(95vh - 180px)" : "auto",
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        <AnimatePresence>
          {Tasks.map((Task, index) => (
            <motion.li
              key={Task.id}
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
              <Checkbox
                checked={Task.completed}
                onCheckedChange={() => toggleTask(Task.id)}
                className="mr-2"
              />
              {editingId === Task.id ? (
                <Input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                  className="flex-grow mr-2 bg-white dark:bg-gray-600 text-gray-800 dark:text-white"
                />
              ) : (
                <motion.span 
                  className={`flex-grow ${Task.completed ? 'text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}
                  animate={{ 
                    textDecoration: Task.completed ? 'line-through' : 'none',
                    y: Task.completed ? [0, -10, 0] : 0,
                  }}
                  transition={{ 
                    duration: 0.3,
                    y: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                >
                  {Task.text}
                  {Task.dueDate && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="inline-block w-4 h-4 mr-1" />
                      {new Date(Task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </motion.span>
              )}
              {editingId === Task.id ? (
                <Button variant="ghost" size="icon" onClick={saveEdit}>
                  <Check className="h-5 w-5 text-green-500" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" onClick={() => startEditing(Task.id, Task.text)}>
                  <Edit2 className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => deleteTask(Task.id)}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.div>
      {Tasks.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No tasks yet. Add one with the button below!</p>
      )}
      <Button
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 addBtn"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusCircle className="h-6 w-6" />
      </Button>

      <TaskEditor
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        newTodo={newTask}
        setNewTodo={setNewTask}
        newTodoDueDate={newTaskDueDate}
        setNewTodoDueDate={setNewTaskDueDate}
        addTodo={addTask}
        bestSuggestion={bestSuggestion}
        handleKeyDown={handleKeyDown}
        handleWheel={handleWheel}
        handleSuggestionClick={handleSuggestionClick}
        inputRef={inputRef}
        today={today}
      />
    </TaskListStyledComponent>
  )
}
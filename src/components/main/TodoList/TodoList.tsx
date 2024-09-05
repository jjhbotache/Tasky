import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import TodoListStyledComponent from './TodoListStyledComponent'
import useGemini from '@/hooks/useGemini'
import useDebounce from '@/hooks/useDebounce'
import levensteinDistance from '@/helpers/levensteinDistance'
import TodoItem from '../TodoItem/TodoItem'
import TaskEditor from '../TaskEditor/TaskEditor'

interface Todo {
  id: number
  text: string
  completed: boolean
  dueDate: string
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editText, setEditText] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newTodo, setNewTodo] = useState('')
  const [newTodoDueDate, setNewTodoDueDate] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [bestSuggestion, setBestSuggestion] = useState('')
  const [suggestionIndex, setSuggestionIndex] = useState(0)
  const { getSuggestions } = useGemini()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTodos(todos.sort((a, b) => Number(a.completed) - Number(b.completed)))
  }, [todos])

  const debouncedGetSuggestions = useDebounce(async (text: string) => {
    const suggestions = await getSuggestions(text)
    if (text.length > 0 && suggestions.length > 0) {
      const filtered = suggestions.filter(
        suggestion => suggestion.toLowerCase().startsWith(text.toLowerCase())
      )
      
      const shortestDistance = filtered.sort((a, b) => levensteinDistance(text, a) - levensteinDistance(text, b))
      setSuggestions(filtered)
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
    if (newTodo.trim() === '') {
      setSuggestions([])
      setBestSuggestion('')
    }else if (newTodo.trim().length > 4 ) {
      setSuggestionIndex(0)
      debouncedGetSuggestions(newTodo)
    }
  }, [newTodo])

  const addTodo = () => {
    if (newTodo.trim() !== '') {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false, dueDate: newTodoDueDate }])
      setNewTodo('')
      setNewTodoDueDate('')
      setBestSuggestion('')
      setIsModalOpen(false)
    }
  }

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id))
  }

  const startEditing = (id: number, text: string, dueDate: string) => {
    setEditingId(id)
    setEditText(text)
    setEditDueDate(dueDate)
    setIsModalOpen(true)
  }

  const saveEdit = () => {
    if (editingId !== null) {
      setTodos(todos.map(todo =>
        todo.id === editingId ? { ...todo, text: editText, dueDate: editDueDate } : todo
      ))
      setEditingId(null)
      setIsModalOpen(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowRight' && bestSuggestion) {
      e.preventDefault()
      setNewTodo(bestSuggestion)
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
    if (inputRef?.current?.focus)setNewTodo(bestSuggestion)
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <TodoListStyledComponent 
      className="w-full max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative"
      animate={{
        height: todos.length > 0 ? "95vh" : "auto",
        transition: { duration: 0.5, ease: "easeInOut" }
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">Tasky</h1>
      <motion.div
        className="overflow-y-auto"
        animate={{
          height: todos.length > 0 ? "calc(95vh - 180px)" : "auto",
          transition: { duration: 0.5, ease: "easeInOut" }
        }}
      >
        <AnimatePresence>
          {todos.map((todo, index) => (
            <motion.li
              key={todo.id}
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
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                onEdit={() => startEditing(todo.id, todo.text, todo.dueDate)}
                onRemove={() => deleteTodo(todo.id)}
                onSave={saveEdit}
                onCancel={() => setEditingId(null)}
                onChange={setEditText}
                onToggle={() => toggleTodo(todo.id)}
              />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.div>
      {todos.length === 0 && (
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
        newTodo={editingId !== null ? editText : newTodo}
        setNewTodo={editingId !== null ? setEditText : setNewTodo}
        newTodoDueDate={editingId !== null ? editDueDate : newTodoDueDate}
        setNewTodoDueDate={editingId !== null ? setEditDueDate : setNewTodoDueDate}
        addTodo={editingId !== null ? saveEdit : addTodo}
        bestSuggestion={bestSuggestion}
        handleKeyDown={handleKeyDown}
        handleWheel={handleWheel}
        handleSuggestionClick={handleSuggestionClick}
        inputRef={inputRef}
        today={today}
      />
    </TodoListStyledComponent>
  )
}
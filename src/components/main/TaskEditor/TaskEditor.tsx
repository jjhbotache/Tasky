import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface TaskEditorProps {
  isModalOpen: boolean
  setIsModalOpen: (isOpen: boolean) => void
  newTodo: string
  setNewTodo: (text: string) => void
  newTodoDueDate: string
  setNewTodoDueDate: (date: string) => void
  addTodo: () => void
  bestSuggestion: string
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
  handleWheel: (e: React.WheelEvent<HTMLInputElement>) => void
  handleSuggestionClick: () => void
  inputRef: React.RefObject<HTMLInputElement>
  today: string
}

const TaskEditor: React.FC<TaskEditorProps> = ({
  isModalOpen,
  setIsModalOpen,
  newTodo,
  setNewTodo,
  newTodoDueDate,
  setNewTodoDueDate,
  addTodo,
  bestSuggestion,
  handleKeyDown,
  handleWheel,
  handleSuggestionClick,
  inputRef,
  today
}) => {
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className='dialog'>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Add a new task with a due date
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              id="taskName"
              ref={inputRef}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onClick={handleSuggestionClick}
              onKeyDown={handleKeyDown}
              onWheel={handleWheel}
              placeholder="Task name"
              className="w-full text-transparent"
              autoComplete='off'
            />
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
              <span className="text-gray-950 pl-3">
                {newTodo}
                {bestSuggestion && (
                  <span className="text-gray-500">{bestSuggestion.slice(newTodo.length)}</span>
                )}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="dueDate"
              type="date"
              value={newTodoDueDate || today}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={addTodo} className='addBtn'>Add Task</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default TaskEditor
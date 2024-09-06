import  { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useTodos, { PseudoTodo } from '@/hooks/useTodos';
import { toast } from 'react-toastify';

interface TaskEditorProps {
  isModalOpen: boolean;
  onClose: () => void;
  taskId: number | null;
}
const today = new Date().toISOString().split('T')[0].toString();
const defaultTask =(id:null|number=null)=>({
  id: id,
  text: '',
  completed: false,
  dueDate: today,
});

function TaskEditor({ isModalOpen, onClose, taskId, }: TaskEditorProps) {
  const { addTodo, updateTodo, getTodo } = useTodos();
  const [taskInEditor, setTaskInEditor] = useState<PseudoTodo>(defaultTask(taskId));

  // create a use effect to retrive info if taskId is not null
  useEffect(() => {
    if (taskId !== null && taskId !== undefined) {
      setTaskInEditor(getTodo(taskId));
    }
  }, [taskId]);


  const handleSave = () => {
    if(taskInEditor.text.trim() === ''){
      toast.error('Task name cannot be empty');
      return;
    }

    taskInEditor.id !== null
      ?updateTodo(taskInEditor.id, taskInEditor.text, taskInEditor.dueDate, taskInEditor.completed)
      :addTodo(taskInEditor.text, taskInEditor.dueDate);
    setTaskInEditor(defaultTask());
    onClose();
  };
  

  function handleOpenChange(isOpen:boolean) {
    setTaskInEditor(defaultTask());
    if (!isOpen) onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='dialog'>
        <DialogHeader>
          <DialogTitle>{taskInEditor.id !== null ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {taskInEditor.id !== null ? 'Edit the task details' : 'Add a new task with a due date'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative">
            <Input
              id="taskName"
              value={taskInEditor.text}
              onChange={(e) => setTaskInEditor({ ...taskInEditor, text: e.target.value })}
              placeholder="Task name"
              className="w-full"
              autoComplete='off'
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="dueDate"
              type="date"
              value={taskInEditor.dueDate}
              onChange={(e) => setTaskInEditor({ ...taskInEditor, dueDate: e.target.value })}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave} className='addBtn'>
            {taskInEditor.id !== null ? 'Save Changes' : 'Add Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskEditor;
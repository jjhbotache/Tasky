import  { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useTodos, { PseudoTodo } from '@/hooks/useTodos';
import { toast } from 'react-toastify';
import PseudoInput from '@/components/global/PseudoInput/PseudoInput';
import useGemini from '@/hooks/useGemini';
import useDebounce from '@/hooks/useDebounce';
import levensteinDistance from '@/helpers/levensteinDistance';

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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(-1);
  const { getSuggestions } = useGemini();

  const debouncedGetSuggestions = useDebounce(()=>{
    setLoadingSuggestions(true);
    getSuggestions(taskInEditor.text).then((suggestions) => {
      const orderedSuggestions = suggestions.sort((a, b) => levensteinDistance(a, taskInEditor.text) - levensteinDistance(b, taskInEditor.text));
      setSuggestions(orderedSuggestions);
      setSuggestionIndex(0);
      setLoadingSuggestions(false);
    });
  }, 500);

  // create a use effect to retrive info if taskId is not null
  useEffect(() => {
    if (taskId !== null && taskId !== undefined) {
      setTaskInEditor(getTodo(taskId));
    }
  }, [taskId]);

  useEffect(() => { 
    if (taskInEditor.text.trim() !== '') {
      debouncedGetSuggestions();
    }
  }, [taskInEditor.text]);

  const handleSave = () => {
    console.log('saving task', taskInEditor);
    
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
          <PseudoInput
            placeholder='Task name'
            suggestion={suggestionIndex !== -1 ? suggestions[suggestionIndex] : ''}
            value={taskInEditor.text}
            loading={loadingSuggestions}
            onChange={(e) => setTaskInEditor({ ...taskInEditor, text: e.target.value })}
            onNextSuggestion={() => setSuggestionIndex((prev) => suggestions[prev + 1] ? prev + 1 : 0)}
            onPrevSuggestion={() => setSuggestionIndex((prev) => suggestions[prev - 1] ? prev - 1 : suggestions.length - 1)}
            onAcceptSuggestion={() => {suggestionIndex !== -1 && !!suggestions[suggestionIndex] && setTaskInEditor({ ...taskInEditor, text: suggestions[suggestionIndex] })}}
          />
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
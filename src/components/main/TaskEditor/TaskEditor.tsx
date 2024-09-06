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
import usePixabay from '@/hooks/usePixabay';

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
  image: '',
});

function TaskEditor({ isModalOpen, onClose, taskId, }: TaskEditorProps) {
  const { addTodo, updateTodo, getTodo } = useTodos();
  const [taskInEditor, setTaskInEditor] = useState<PseudoTodo>(defaultTask(taskId));
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestedImgs, setSuggestedImgs] = useState<string[]>([]);
  const [imgIndex, setImgIndex] = useState<number|undefined>();
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState<number>(-1);
  const { getSuggestions } = useGemini();
  const {getImgs} = usePixabay();

  const debouncedGetSuggestions = useDebounce(()=>{
    setLoadingSuggestions(true);
    getSuggestions(taskInEditor.text).then((suggestions) => {
      const orderedSuggestions = suggestions.sort((a, b) => levensteinDistance(a, taskInEditor.text) - levensteinDistance(b, taskInEditor.text));
      setSuggestions(orderedSuggestions);
      setSuggestionIndex(0);
      setLoadingSuggestions(false);
    });

    getImgs(taskInEditor.text).then((imgs) => {
      if(imgs.length === 0) {
        setSuggestedImgs([]);
        setImgIndex(undefined);
      }else{
        setSuggestedImgs(imgs);
        setImgIndex(Math.floor(Math.random() * imgs.length));
      }
    })

  }, 500);

  useEffect(() => {
    // reset all
    setTaskInEditor(defaultTask(taskId));
    setSuggestions([]);
    setSuggestedImgs([]);
  }, []);

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

  useEffect(() => {
    
    (imgIndex!== undefined) && setTaskInEditor({ ...taskInEditor, image: suggestedImgs[imgIndex] })
  }, [imgIndex]);

  const handleSave = () => {
    if(taskInEditor.text.trim() === ''){
      toast.error('Task name cannot be empty');
      return;
    }
    

    if(taskInEditor.id !== null){
      updateTodo(taskInEditor.id, taskInEditor.text, taskInEditor.dueDate, taskInEditor.completed, taskInEditor.image)
      toast.success('Task updated');
    }else{
      addTodo(taskInEditor.text, taskInEditor.dueDate, taskInEditor.image);
      toast.success('Task added');
    }

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
        { taskInEditor.image && <div className='imgContainer'>
          <img className="taskImg" src={taskInEditor.image}/>
        </div>}
        <DialogHeader>
          <DialogTitle>{taskInEditor.id !== null ? 'Edit Task' : 'Add New Task'}</DialogTitle>
          <DialogDescription>
            {taskInEditor.id !== null ? 'Edit the task details' : 'Add a new task with a due date'}
          </DialogDescription>
          <div className='text-gray-400 text-left font-thin text-sm'>
            <ul className='list-disc ml-6'>
              <li>press the arrow or swipe, the input, down or up to see more suggestions</li>
              <li>press enter or double tap to accept a suggestion</li>
            </ul>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4 ">
          {/* input */}
          <div>
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
            <small className="text-gray-500 ml-3">AI powered suggestions!</small>
          </div>
          {/* date */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="dueDate"
              type="date"
              value={taskInEditor.dueDate}
              onChange={(e) => setTaskInEditor({ ...taskInEditor, dueDate: e.target.value })}
              className="col-span-3"
            />
          </div>
          {/* image */}
          {!!suggestedImgs.length ? <div className="flex items-center">
            <img src={suggestedImgs[imgIndex||0]} alt="Suggested Image" className="w-16 h-16 rounded-full mr-4" />
            <Button onClick={() => setImgIndex(suggestedImgs[(imgIndex||0) + 1] ? (imgIndex||0) + 1 : 0 )}>
              Next Image
            </Button>
          </div>:
          <span className="text-gray-500">No images found</span>
          }
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
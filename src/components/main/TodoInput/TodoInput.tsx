import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import TodoInputStyledComponent from './TodoInputStyledComponent';
import { colors } from '@/constants/styleConstants';
import useGemini from '@/hooks/useGemini';
import useDebounce from '@/hooks/useDebounce';
import levensteinDistance from '@/helpers/levensteinDistance';
import { log } from 'console';
import { toast } from 'react-toastify';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

const TodoInput: React.FC<TodoInputProps> = ({ onAdd }) => {
  const [newTodo, setNewTodo] = useState<string>('');
  const [bestSuggestion, setBestSuggestion] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState<number>(-1);
  const { getSuggestions } = useGemini();

  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);
  
  const getAndSetSuggestions = async () => {
    const suggestions = await getSuggestions(newTodo);
    if(newTodo.length > 4){ 
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
      setBestSuggestion('');
    }
  };
  const debouceGetSuggestions = useDebounce(getAndSetSuggestions, 300);

  useEffect(() => {
    if (newTodo === '') {
      setBestSuggestion('');
      setSuggestions([]);
      setSelectedSuggestionIndex(-1);
      return;
    }
    if (newTodo.length > 0 && suggestions.length > 0) {
      const filtered = suggestions.filter(
        suggestion => suggestion.toLowerCase().startsWith(newTodo.toLowerCase())
      );
      setBestSuggestion(filtered.length > 0 ? filtered[0] : '');
    } else {
      setBestSuggestion('');
    }

    if (newTodo.length > 4){
      debouceGetSuggestions();
    }
  }, [newTodo]);

  useEffect(() => {
    if (suggestions.length > 0) {
      const filtered = suggestions.filter(
        suggestion => suggestion.toLowerCase().startsWith(newTodo.toLowerCase())
      );
      const shortestDistance = filtered.sort((a, b) => levensteinDistance(newTodo, a) - levensteinDistance(newTodo, b));
      const newSuggestion = shortestDistance.length > 0 ? shortestDistance[0] : '';
      setBestSuggestion(newSuggestion);

    }
  }, [suggestions, newTodo]);

  useEffect(() => {
    if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
      setBestSuggestion(suggestions[selectedSuggestionIndex]);
    }
  }, [selectedSuggestionIndex, suggestions]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    
    if (e.key === 'Tab' && bestSuggestion) {
      e.preventDefault();
      setNewTodo(bestSuggestion);
    } else if (e.key === 'Enter') {
      handleAdd();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0));
    } 
  };

  const handleAdd = () => {
    if (newTodo.trim() !== '') {
      onAdd(newTodo.trim());
      setNewTodo('');
      setBestSuggestion('');
      setSelectedSuggestionIndex(-1);
    }else{
      toast.error('Please enter a todo!');
    }
    inputRef.current?.focus();  
  };



  return (
    <TodoInputStyledComponent className="mb-4 flex items-center gap-1">
      <div className='overflow-hidden relative w-full'>
        <Input
          ref={inputRef}
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDownCapture={handleKeyDown}
          placeholder="Agregar nueva tarea..."
          className="w-full bg-gray-100 flex justify-start align-top text-red-600 text-base box-border  word-wrap text-transparent"
          maxLength={100}
        />
        <div className="absolute top-0 left-0  pl-3 pt-2 text-base box-border" ref={suggestionRef}
        onClick={() => inputRef.current?.focus()}>
          <span style={{color:colors.textColor}}>
            {newTodo}
            {(bestSuggestion && !!newTodo) && <span className="text-red-950">{bestSuggestion.slice(newTodo.length)}</span> }
          </span>
        </div>
      </div>
      
      <Button onClick={handleAdd} className="bg-gray-800 text-white hover:bg-gray-700 rounded-lg addBtn">
        <PlusCircle className="h-5 w-5 mr-2" />
        Add
      </Button>
    </TodoInputStyledComponent>
  );
};

export default TodoInput;
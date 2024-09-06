import { PseudoInputStyledComponent } from "./PseudoInputStyledComponent";

// Define the props for the PseudoInput component
interface PseudoInputProps {
  placeholder: string;
  suggestion: string;
  value: string;
  loading: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNextSuggestion: () => void;
  onPrevSuggestion: () => void;
  onAcceptSuggestion: () => void;
}

const dragUmbral = 2;

export default function PseudoInput({ placeholder, suggestion, value, loading, onChange, onNextSuggestion, onPrevSuggestion, onAcceptSuggestion }: PseudoInputProps) {

  const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: any) => {
    if (info.delta.y < dragUmbral) {
      onNextSuggestion(); 
    } else if (info.delta.y > dragUmbral) {
      onPrevSuggestion(); 
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onAcceptSuggestion(); 
    } else if (e.key === 'ArrowDown') {
      onNextSuggestion(); 
    } else if (e.key === 'ArrowUp') {
      onPrevSuggestion(); 
    }
  }

  return (
    <PseudoInputStyledComponent
      className='pseudo-input'
      drag="y" // Enable vertical dragging
      dragConstraints={{ top: 5, left: 0, right: 0, bottom: 5 }} // Set drag constraints
      dragElastic={0.1} // Set drag elasticity
      dragSnapToOrigin // Snap back to origin after drag
      onDoubleClick={onAcceptSuggestion} // Call onAcceptSuggestion on double click
      onDragEnd={handleDrag} // Call handleDrag on drag end
      onKeyPress={handleKeyPress} // Call handleKeyPress on key press
      loading={loading ? "true" : undefined}> {/* Set loading state */}
      <input
        type="text"
        value={value} // Set input value
        onChange={onChange} // Call onChange on input change
        placeholder={placeholder} // Set input placeholder
        autoComplete="off" // Disable autocomplete
        onDoubleClick={onAcceptSuggestion} // Call onAcceptSuggestion on double click
        onKeyDownCapture={handleKeyPress} // Call handleKeyPress on key down
      />
      {(suggestion?.startsWith(value) && !!value) && <div className='pseudo-input__suggestion text-gray-400'>{suggestion}</div>} {/* Display suggestion if it starts with the input value */}
      <div className='pseudo-input__text'>{value}</div> {/* Display input value */}
      {!value.length && <div className='pseudo-input__placeholder text-gray-400'>{placeholder}</div>} {/* Display placeholder if input is empty */}
    </PseudoInputStyledComponent>
  );
}



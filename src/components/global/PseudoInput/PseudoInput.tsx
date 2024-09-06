import { colors } from '@/constants/styleConstants';
import { motion } from 'framer-motion';
import styled, { keyframes, css } from 'styled-components';

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
    <PseudoInputContainer
      className='pseudo-input'
      drag="y"
      dragConstraints={{ top: 5, left: 0, right: 0, bottom: 5 }}
      dragElastic={0.1}
      dragSnapToOrigin
      onDoubleClick={onAcceptSuggestion}
      onDragEnd={handleDrag}
      onKeyPress={handleKeyPress}
      loading={loading}>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="off"
        onDoubleClick={onAcceptSuggestion}
        onKeyDownCapture={handleKeyPress}
      />
      {(suggestion?.startsWith(value) && !!value) && <div className='pseudo-input__suggestion text-gray-400'>{suggestion}</div>}
      <div className='pseudo-input__text'>{value}</div>
      {!value.length && <div className='pseudo-input__placeholder text-gray-400'>{placeholder}</div>}
    </PseudoInputContainer>
  );
}

interface PseudoInputContainerProps {
  loading: boolean;
}
const PseudoInputContainer = styled(motion.div)<PseudoInputContainerProps>`
  background-color: white;
  width: 100%;
  padding: .5rem;
  word-break: break-word;
  border-radius: .6rem;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: 4rem;

  display: flex;
  align-items: center;
  position: relative;
  ${props =>
    props.loading &&
    css`
      animation: ${loadingAnimation} 1s infinite;
    `}

  input {
    z-index: 5;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  &:focus-within {
    box-shadow: 0px 0px .5em  ${colors.primaryColor};
  }

  & .pseudo-input__text {
    display: block;
    position: relative;
    pointer-events: none;
    min-height: 1.2rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    z-index: 2;
    color: ${colors.textColor};
  }

  & .pseudo-input__suggestion {
    position: absolute;
    top: 0;
    left: 0;
    padding: .5rem;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
`;

const loadingAnimation = keyframes`
  0%,100% {
    box-shadow: 0px 0px .2em  ${colors.primaryColor};
  }
  50% {
    box-shadow: 0px 0px .7em  ${colors.secondaryColor};
  }
`;
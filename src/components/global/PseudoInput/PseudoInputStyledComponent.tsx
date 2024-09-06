import { colors } from "@/constants/styleConstants";
import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";
// Define the props for the PseudoInputContainer component
interface PseudoInputContainerProps {
  loading?: string;
}

// Styled component for the PseudoInput container
export const PseudoInputStyledComponent = styled(motion.div)<PseudoInputContainerProps>`
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
    props.loading == "true" &&
    css`
      animation: ${loadingAnimation} 1s infinite; // Apply loading animation if loading is true
    `}

  input {
    z-index: 5;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0; // Hide the input element
  }

  &:focus-within {
    box-shadow: 0px 0px .5em  ${colors.primaryColor}; // Apply box shadow when focused
  }

  & .pseudo-input__text {
    display: block;
    position: relative;
    pointer-events: none;
    min-height: 1.2rem;
    white-space: pre-wrap;
    word-wrap: break-word;
    z-index: 2;
    color: ${colors.textColor}; // Set text color
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

// Keyframes for the loading animation
const loadingAnimation = keyframes`
  0%,100% {
    box-shadow: 0px 0px .5em  ${colors.secondaryColor}; // Initial and final state
  }
  50% {
    box-shadow: 0px 0px .8em  ${colors.textColor}; // Middle state
  }
`;
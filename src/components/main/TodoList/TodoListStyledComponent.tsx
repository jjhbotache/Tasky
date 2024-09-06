import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@/constants/styleConstants';

const TodoListStyledComponent = styled(motion.div)`
  background: ${colors.primaryColor};
  color: ${colors.textColor};
  box-shadow:  1.2em 1.2em 2.2em #8b8b8b,
              -1.2em -1.2em 2.2em #ffffff;

  box-sizing: border-box;
  border-radius: 1em;

  overflow-y: auto;
  scrollbar-width: none;
  --webkit-scrollbar-width: none;

  .addBtn{
    background: ${colors.secondaryColor};
    color: ${colors.textColor};
    box-shadow:  1em 1em 2em #8b8b8b;
    &:hover{
      background: ${colors.tertiaryColor};
      box-shadow:  .8em .8em 2em #8b8b8b;
    }
    &:focus{
      background: ${colors.tertiaryColor};
      border: 1px solid ${colors.textColor};
    }
    &:active{
      background: ${colors.tertiaryColor};
      box-shadow: inset .2em .2em .4em #8b8b8b;
    }
  }
`;
export default TodoListStyledComponent;
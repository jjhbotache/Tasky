import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@/constants/styleConstants';

const TodoListStyledComponent = styled(motion.div)`
  background: ${colors.primaryColor};
  color: ${colors.textColor};
  box-shadow:  1.2em 1.2em 2.2em #8b8b8b,
              -1.2em -1.2em 2.2em #ffffff;

  max-height: 85vh;
  overflow-y: auto;
  /* hide the scroll bar */
  scrollbar-width: none;
  --webkit-scrollbar-width: none;


  .header {
    background: ${colors.primaryColor};
    backdrop-filter: blur(10px);
  }

  .addBtn{
    color : ${colors.textColor};
    background-color: ${colors.tertiaryColor};
    box-shadow:  3px 3px 6px #5a5a5a,
             -3px -3px 6px #ffffff;
    transition: all 0.4s;
    &:hover{
      background-color: ${colors.secondaryColor};
    }
    &:active {
      transform: scale(0.98);
      box-shadow: inset 0 0 13px rgba(0, 0, 0, 0.9),
      1px 1px 2px #5a5a5a;
    }
  }

  .dialog{
    background: red;
  }


`;
export default TodoListStyledComponent;
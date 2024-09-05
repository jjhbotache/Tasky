import styled from 'styled-components';
import { motion } from 'framer-motion';
import { colors } from '@/constants/styleConstants';

const TodoListStyledComponent = styled(motion.div)`
  background: ${colors.primaryColor};
  color: ${colors.textColor};
  box-shadow:  1.2em 1.2em 2.2em #8b8b8b,
              -1.2em -1.2em 2.2em #ffffff;

  height: clamp(800px, auto, 90vh);
  overflow-y: auto;
  /* hide the scroll bar */
  scrollbar-width: thin;
  --webkit-scrollbar-width: thin;


  .header {
    background: ${colors.primaryColor};
    backdrop-filter: blur(10px);
  }


`;
export default TodoListStyledComponent;
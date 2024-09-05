import styled from 'styled-components';
import {colors} from '@/constants/styleConstants';

const TodoListStyledComponent = styled.div`
  background: ${colors.primaryColor};
  box-shadow:  1.2em 1.2em 2.2em #8b8b8b,
              -1.2em -1.2em 2.2em #ffffff;

  max-height: 90vh;
  overflow-y: auto;
  /* hide the scroll bar */
  scrollbar-width: none;
  --webkit-scrollbar-width: none;


  .header {
    background: ${colors.primaryColor};
    backdrop-filter: blur(10px);
  }


`;
export default TodoListStyledComponent;
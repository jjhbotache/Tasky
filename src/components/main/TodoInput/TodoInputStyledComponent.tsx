import { colors } from "@/constants/styleConstants";
import styled from "styled-components";

const TodoInputStyledComponent = styled.div`

  .addBtn{
    background-color: ${colors.secondaryColor};
    color: ${colors.textColor};
    transition: all 0.3s;
    
    &:hover{
      background-color: ${colors.tertiaryColor};
    }
    &:active {
      transform: scale(0.98);
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.2);
    }

  }
`;
export default TodoInputStyledComponent;
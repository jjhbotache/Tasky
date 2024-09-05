import styled from "styled-components";

const TodoItemStyledComponent = styled.div`
  box-shadow:  7px 7px 14px #bebebe,
              -7px -7px 14px #ffffff;

  .animatedBtn{
    transition: all 0.3s;
    aspect-ratio: 1/1;
    width: 60px;
    &:hover{
      transform: scale(1.3);
      box-shadow:  7px 7px 14px #bebebe,
              -7px -7px 14px #ffffff;
    }
    &:active{
      transform: scale(1.1);
      box-shadow:  7px 7px 14px #bebebe,
              -7px -7px 14px #ffffff;
    }
  }
  
`;
export default TodoItemStyledComponent;

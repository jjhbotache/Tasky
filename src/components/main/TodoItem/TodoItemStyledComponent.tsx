import styled from "styled-components";

const TodoItemStyledComponent = styled.div`
  box-shadow:  7px 7px 14px #bebebe,
              -7px -7px 14px #ffffff;
  position: relative;

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

  .bgImgContainer{
    position: absolute;
    height: 100%;
    width: 100%;
    right: 0;
    bottom: 0;
    z-index: 1;
    img{
      position: absolute;
      height: 100%;
      width: 100%;
      object-fit: cover;  

    }
    &::after{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 150%;
      height: 150%;
      background: linear-gradient(
        to right bottom,
        #ffffffdd 0%, 
        #ffffffdd 30%, 
        #ffffff00 100%
        );
      z-index: 1;
    }
  }
  
`;
export default TodoItemStyledComponent;

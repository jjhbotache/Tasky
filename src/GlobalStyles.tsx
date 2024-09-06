import { createGlobalStyle } from "styled-components";
import { colors } from "./constants/styleConstants";

const  GlobalStyles = createGlobalStyle`



html,body,#root{
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  height: 100% !important ;
}

#root{
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e7fff7;
  padding: 10px;
}


.dialog{
  background: ${colors.quaternaryColor};
  color: ${colors.textColor};
  input{
    border: 1px solid ${colors.tertiaryColor};
  }
  button{
    background: ${colors.tertiaryColor};
    color: ${colors.textColor};
    transition: 0.2s;
    &:hover{
      box-shadow:  5px 5px 12px #5a5a5a,
             -5px -5px 12px #ffffff;
    }
    &:active{
      background: ${colors.primaryColor};
      box-shadow: 0 0 5px black inset;
    }
  }
}

.imgContainer{
  width: 100%;
  height: 100%;
  
  position: absolute;
  
  z-index: -1;
  opacity: 0.8;
}
.taskImg{
  position: absolute;
  object-fit: cover;
  right: 0%;
  bottom: 0%;
  min-height: 300px;  
}
.imgContainer::after{
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right bottom,
     #faf3dd 0%, 
     #faf3dd 30%, 
     #faf3dd00 100%
    );
  z-index: 1;
}

`;

export default GlobalStyles;
import { ToastContainer } from "react-toastify";
import Main from "./pages/Main";
import 'react-toastify/dist/ReactToastify.min.css';
import GlobalStyles from "./GlobalStyles";
import { Todo } from "./hooks/useTodos";
import { createContext, useEffect, useState } from "react";


export const TodoContext = createContext<{
  tasks: Todo[];
  setTasks: (tasks: Todo[]) => void;
}>({ tasks: [], setTasks: () => {} });

function App() {
  const [tasks, setTasks] = useState<Todo[]>( JSON.parse(sessionStorage.getItem('todos') || '[]'));

  return <>
    <TodoContext.Provider value={{ tasks,setTasks }}>
    <GlobalStyles/>
    <ToastContainer
      autoClose={2000}
      pauseOnHover={false}
    />
    <Main />
    </TodoContext.Provider>
  </>;
}

export default App;
import { ToastContainer } from "react-toastify";
import Main from "./pages/Main";
import 'react-toastify/dist/ReactToastify.min.css';

function App() {
  return <>
    <ToastContainer
      autoClose={2000}
    />
    <Main />
  </>;
}

export default App;
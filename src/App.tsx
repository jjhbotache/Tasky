import { ToastContainer } from "react-toastify";
import Main from "./pages/Main";
import 'react-toastify/dist/ReactToastify.min.css';
import GlobalStyles from "./GlobalStyles";



function App() {
  return <>
    <GlobalStyles/>
    <ToastContainer
      autoClose={2000}
      pauseOnHover={false}
    />
    <Main />
  </>;
}

export default App;
import { Bounce, ToastContainer } from "react-toastify";
import Main from "./pages/Main";

function App() {
  // return <h1 className="text-9xl">App</h1>;
  return <>
  <ToastContainer
  position="top-right"
  autoClose={3000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  draggable
  pauseOnHover
  theme="light"
  transition={Bounce}
  />
    <Main />
  <ToastContainer />
  </>;
}

export default App;
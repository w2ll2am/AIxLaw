import './App.css'
import ChatBox from './ChatBox'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <>
      <div style={{display:'flex'}}>
        <ToastContainer />
        <ChatBox/>
      </div>

    </>
  )
}

export default App

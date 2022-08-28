import { Route, Routes } from "react-router-dom"
import About from "./pages/About"
import Home from './pages/Home';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
      </Routes>
    </div >
  );
}

export default App;

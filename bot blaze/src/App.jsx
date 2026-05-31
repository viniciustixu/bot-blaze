import { Routes, Route } from 'react-router-dom';
import Inicio from './pages/Inicio';
import Config from './pages/Config';
import Controles from './pages/Controles';
import Layout from './Components/Layout';
import './App.css';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Inicio />} />
        <Route path='/config' element={<Config />} />
        <Route path='/controles' element={<Controles />} />
      </Route>
    </Routes>
  );
}

export default App;

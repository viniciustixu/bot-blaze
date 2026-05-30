import { useEffect, useState } from 'react';
import './App.css';
import BackgroundParticles from './Components/BackgroundParticles';
import StartButton from './Components/StartButton';
import ChatDisplay from './Components/ChatDisplay';
import LogoBot from './Components/LogoBot';
import DragBar from './Components/DragBar';

function App() {
  const [status, setStatus] = useState('off');
  const [aquecendo, setAquecendo] = useState(false);
  const [fila, setFila] = useState([]);

  async function atualizarEstado() {
    const novoStatus = await window.electronAPI.botRodando();

    const novoAquecimento = await window.electronAPI.botAquecendo();

    const novaFila = await window.electronAPI.botFila();

    setStatus(novoStatus);
    setAquecendo(novoAquecimento);
    setFila(novaFila);
  }

  async function iniciarPausarBot() {
    window.electronAPI.iniciarPausarBot();

    atualizarEstado();
  }

  useEffect(() => {
    atualizarEstado();

    const interval = setInterval(() => {
      atualizarEstado();
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className='relative h-screen'>
      <BackgroundParticles />
      <DragBar />

      <div className='flex justify-around'>
        <div className='flex flex-col justify-evenly'>
          <LogoBot />
          <StartButton status={status} aquecendo={aquecendo} onClick={iniciarPausarBot} />
        </div>

        <ChatDisplay fila={fila} />
      </div>
    </div>
  );
}

export default App;

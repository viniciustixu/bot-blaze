import { useEffect, useState } from 'react';
import './App.css';
import BackgroundParticles from './Components/BackgroundParticles';

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
      <div className='text-2xl titlebar w-full pb-16 text-center text-white'></div>
      <BackgroundParticles />

      <div className='flex justify-around'>
        <div className='flex flex-col items-center'>
          <h1 className='text-7xl font-bold text-[rgb(255,20,255)] drop-shadow-lg'>Bot Blaze mt foda</h1>
          <div className='flex justify-center mt-15'>
            <button
              className='btn btn-xl rounded-full w-[140px] disabled:opacity-100 disabled:bg-white text-black z-10'
              onClick={iniciarPausarBot}
              disabled={aquecendo}>
              {aquecendo ? (
                <span className='loading loading-spinner loading-xs'></span>
              ) : status === 'off' ? (
                'Iniciar'
              ) : (
                'Parar'
              )}
            </button>
          </div>
        </div>

        <div className='chat chat-end mt-10 px-10 bg-[rgb(24,24,24)] rounded-2xl w-[400px] h-[450px] z-10'>
          <div className='flex flex-col gap-2 mt-5 '>
            {fila.map((item) => (
              <div
                key={item.uuid}
                className='flex w-fit chat-bubble whitespace-nowrap rounded-2xl rounded-br-none px-10 text-2xl'>
                {item.usuario + ': ' + item.mensagem.slice(1)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

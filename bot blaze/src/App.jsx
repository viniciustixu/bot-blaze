import { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('off');
  const [aquecendo, setAquecendo] = useState(false);

  async function atualizarEstado() {
    const novoStatus = await window.electronAPI.botRodando();

    const novoAquecimento = await window.electronAPI.botAquecendo();

    setStatus(novoStatus);
    setAquecendo(novoAquecimento);
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
    <>
      <h1>Bot Blaze mt foda</h1>

      <button onClick={iniciarPausarBot} disabled={aquecendo}>
        {aquecendo ? 'Iniciando...' : status === 'off' ? 'Iniciar' : 'Parar'}
      </button>
    </>
  );
}

export default App;

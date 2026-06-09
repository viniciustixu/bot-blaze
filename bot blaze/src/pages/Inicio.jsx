import { useEffect, useState } from 'react';

import StartButton from '../Components/StartButton';
import ChatDisplay from '../Components/ChatDisplay';
import LogoBot from '../Components/LogoBot';
import { useOutletContext } from 'react-router-dom';

function Inicio() {
  const [status, setStatus] = useState('off');
  const [fila, setFila] = useState([]);
  const { setErro } = useOutletContext();
  const [executando, setExecutando] = useState(null);

  async function atualizarEstado() {
    const novoStatus = await window.electronAPI.botRodando();
    const novaFila = await window.electronAPI.botFila();
    const comandoExecutando = await window.electronAPI.botExecutando();

    setExecutando(comandoExecutando);

    setStatus(novoStatus);
    setFila(novaFila);
  }

  async function iniciarPausarBot() {
    const resultado = await window.electronAPI.iniciarPausarBot();

    if (resultado?.erro) {
      setErro(resultado.erro);
    }

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
    <div className=' h-screen'>
      <div className='flex justify-around'>
        <div className='flex flex-col justify-evenly'>
          <LogoBot />
          <StartButton status={status} onClick={iniciarPausarBot} />
        </div>

        <ChatDisplay fila={fila} executando={executando} />
      </div>
    </div>
  );
}

export default Inicio;

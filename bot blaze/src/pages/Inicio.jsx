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
  const [cmdCount, setCmdCount] = useState(0);

  async function atualizarEstado() {
    const novoStatus = await window.electronAPI.botRodando();
    const novaFila = await window.electronAPI.botFila();
    const comandoExecutando = await window.electronAPI.botExecutando();
    const count = await window.electronAPI.botCmdCount();

    setExecutando(comandoExecutando);
    setCmdCount(count);
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

        <div className='relative'>
          <span className='absolute top-0 left-1/2 -translate-x-1/2 text-[rgb(255,20,255)] text-lg font-atkinsonb font-bold z-10 whitespace-nowrap'>{cmdCount}</span>
          <ChatDisplay fila={fila} executando={executando} />
        </div>
      </div>
    </div>
  );
}

export default Inicio;

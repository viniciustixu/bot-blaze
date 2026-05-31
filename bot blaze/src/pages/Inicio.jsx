import { useEffect, useState } from 'react';
// import BackgroundParticles from '../Components/BackgroundParticles';
import StartButton from '../Components/StartButton';
import ChatDisplay from '../Components/ChatDisplay';
import LogoBot from '../Components/LogoBot';
import { useOutletContext } from 'react-router-dom';
// import DragBar from '../Components/DragBar';
// import ErrorAlert from '../Components/ErrorAlert';
// import TabSelector from '../Components/TabSelector';

function Inicio() {
  const [status, setStatus] = useState('off');
  const [aquecendo, setAquecendo] = useState(false);
  const [fila, setFila] = useState([]);
  const { setErro } = useOutletContext();

  async function atualizarEstado() {
    const novoStatus = await window.electronAPI.botRodando();
    const novoAquecimento = await window.electronAPI.botAquecendo();
    const novaFila = await window.electronAPI.botFila();

    setStatus(novoStatus);
    setAquecendo(novoAquecimento);
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
      {/* <BackgroundParticles /> */}
      {/* <DragBar /> */}
      {/* <TabSelector /> */}

      <div className='flex justify-around'>
        <div className='flex flex-col justify-evenly'>
          <LogoBot />
          <StartButton status={status} aquecendo={aquecendo} onClick={iniciarPausarBot} />
          {/* <ErrorAlert mensagem={erro} setErro={setErro} /> */}
        </div>

        <ChatDisplay fila={fila} />
      </div>
    </div>
  );
}

export default Inicio;

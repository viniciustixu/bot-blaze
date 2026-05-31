import { useEffect, useState } from 'react';
import CommandCard from '../Components/CommandCard';
import { useOutletContext } from 'react-router-dom';
import CriarComando from '../Components/CriarComando';

function Controles() {
  const [comandos, setComandos] = useState([]);
  const { setErro } = useOutletContext();

  async function carregarComandos() {
    const dados = await window.electronAPI.getCommands();

    const lista = Object.entries(dados).map(([comando, info]) => ({
      comando,
      tecla: info.tecla,
      delay: info.delay,
    }));

    setComandos(lista);
  }

  async function criarComando() {
    const res = await window.electronAPI.createCommand({
      comando: '!novo',
      tecla: 'Z',
      delay: 1000,
    });

    if (res?.erro) {
      setErro(res.erro);

      setTimeout(() => {
        setErro('');
      }, 3000);

      return;
    }

    carregarComandos();
  }

  async function deletarComando(comando) {
    await window.electronAPI.deleteCommand(comando);
    carregarComandos();
  }

  async function atualizarComando(oldComando, novo) {
    await window.electronAPI.updateCommand(oldComando, novo);
    carregarComandos();
  }

  useEffect(() => {
    carregarComandos();
  }, []);

  return (
    <div className='m-10 h-screen'>
      <div className='mb-6 '>
        <CriarComando criarComando={criarComando} />
      </div>

      <div className='flex gap-4 flex-wrap justify-center'>
        {comandos.map((item) => (
          <CommandCard
            key={item.comando}
            comando={item.comando}
            tecla={item.tecla}
            delay={item.delay}
            onDelete={deletarComando}
            onUpdate={atualizarComando}
          />
        ))}
      </div>
    </div>
  );
}

export default Controles;

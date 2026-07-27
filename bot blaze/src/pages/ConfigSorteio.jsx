import { useEffect, useState } from 'react';
import OkAlert from '../Components/OkAlert';

function ConfigSorteio() {
  const [showAlert, setShowAlert] = useState(false);

  const [config, setConfig] = useState({
    comando: '!sorteio',
    intervalo: 15,
    pontos: 10,
    multiplicadorSub: 2,
    mensagem: 'Parabéns ${user}, voce ganhou o sorteio!!! 😱',
  });

  useEffect(() => {
    async function carregar() {
      const dados = await window.electronAPI.getSorteioConfig();
      setConfig(dados);
    }
    carregar();
  }, []);

  return (
    <div className='flex justify-center h-screen'>
      <div className='flex flex-col'>
        <h1 className='text-5xl font-bold text-[rgb(255,20,255)] drop-shadow-lg text-center mt-6'>SORTEIO</h1>

        <div className='flex flex-col p-5 text-white gap-4 h-fit rounded-2xl mt-6 z-10 content-center border-2 border-[rgb(255,20,255)]'>
          {/* COMANDO */}
          <div className='flex gap-2 items-center justify-between'>
            <label className='text-[rgb(255,20,255)]'>Comando:</label>
            <input
              className='input text-black w-fit bg-white focus:outline-none border border-[#464E58]'
              value={config.comando}
              onChange={(e) => setConfig({ ...config, comando: e.target.value })}
            />
          </div>

          {/* INTERVALO */}
          <div className='flex gap-2 items-center justify-between'>
            <label className='text-[rgb(255,20,255)]'>Intervalo(mins):</label>
            <input
              className='input text-black w-fit bg-white focus:outline-none border border-[#464E58]'
              type='number'
              min='1'
              value={config.intervalo}
              onChange={(e) => setConfig({ ...config, intervalo: Number(e.target.value) })}
            />
          </div>

          {/* PONTOS POR INTERAGIR */}
          <div className='flex gap-2 items-center justify-between'>
            <label className='text-[rgb(255,20,255)]'>Pontos por interagir:</label>
            <input
              className='input text-black w-fit bg-white focus:outline-none border border-[#464E58]'
              type='number'
              min='1'
              value={config.pontos}
              onChange={(e) => setConfig({ ...config, pontos: Number(e.target.value) })}
            />
          </div>

          {/* MULTIPLICADOR DE INSCRITOS */}
          <div className='flex gap-2 items-center justify-between'>
            <label className='text-[rgb(255,20,255)]'>multiplicador de inscritos:</label>
            <input
              className='input text-black w-fit bg-white focus:outline-none border border-[#464E58]'
              type='number'
              min='1'
              value={config.multiplicadorSub}
              onChange={(e) => setConfig({ ...config, multiplicadorSub: Number(e.target.value) })}
            />
          </div>

          {/* MENSAGEM DO VENCEDOR */}
          <div className='flex gap-2 items-center justify-between'>
            <label className='text-[rgb(255,20,255)]'>Mensagem do vencedor:</label>
            <textarea
              className='text-black bg-white focus:outline-none border border-[#464E58] rounded-md p-2 w-80 h-24 resize-none overscroll-contain'
              value={config.mensagem}
              onChange={(e) => setConfig({ ...config, mensagem: e.target.value })}
              maxLength={450}
            />
          </div>

          <button
            className='btn btn-outline btn-success'
            onClick={() => {
              window.electronAPI.saveSorteioConfig(config);
              setShowAlert(true);
              setTimeout(() => setShowAlert(false), 3000);
            }}>
            Salvar
          </button>
          {showAlert && <OkAlert />}
        </div>
      </div>
    </div>
  );
}

export default ConfigSorteio;

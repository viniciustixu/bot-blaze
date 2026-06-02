import { useEffect, useState } from 'react';
import kirbyBite from '../assets/kirbybite.png';
import OkAlert from '../Components/OkAlert';

function Config() {
  const [config, setConfig] = useState({
    url: '',
    delayEntreTeclas: 3000,
    submode: false,
    modo: 'sequencial',
  });

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    async function carregar() {
      const dados = await window.electronAPI.getConfig();

      setConfig(dados);
    }

    carregar();
  }, []);

  return (
    <div className='flex justify-center h-screen '>
      <div className='flex flex-col p-5 text-white gap-4 h-fit rounded-2xl mt-24 z-10 content-center w-[300px] border-2 border-[rgb(255,20,255)] '>
        {/* URL */}
        <div className='flex gap-2 items-center justify-between'>
          <label className='text-[rgb(255,20,255)]'>URL</label>
          <input
            className='input text-black w-fit'
            value={config.url}
            onChange={(e) =>
              setConfig({
                ...config,
                url: e.target.value,
              })
            }
          />
        </div>

        {/* Delay */}
        <div className='flex gap-2 items-center justify-between'>
          <label className='text-[rgb(255,20,255)]'>Delay Entre Teclas</label>
          <input
            className='input text-black  w-[100px]'
            type='number'
            value={config.delayEntreTeclas}
            onChange={(e) =>
              setConfig({
                ...config,
                delayEntreTeclas: Number(e.target.value),
              })
            }
          />
        </div>

        {/* Submode */}
        <div className='flex gap-2 text-white justify-between'>
          <label className='text-[rgb(255,20,255)]'>Submode</label>
          <input
            className='toggle toggle-success toggle-md bg-white'
            type='checkbox'
            checked={config.submode}
            onChange={(e) =>
              setConfig({
                ...config,
                submode: e.target.checked,
              })
            }
          />
        </div>

        {/* Modo */}
        <div className='flex gap-2 items-center justify-between'>
          <label className='text-[rgb(255,20,255)]'>Modo</label>
          <select
            className='select text-black rounded-2xl w-[130px]'
            value={config.modo}
            onChange={(e) =>
              setConfig({
                ...config,
                modo: e.target.value,
              })
            }>
            <option value='sequencial'>sequencial</option>
            <option value='anarquia'>anarquia</option>
          </select>
        </div>
        <button
          className='btn btn-outline btn-success'
          onClick={() => {
            window.electronAPI.saveConfig(config);

            setShowAlert(true);

            setTimeout(() => {
              setShowAlert(false);
            }, 3000);
          }}>
          Salvar
        </button>
        {showAlert && <OkAlert />}
      </div>
      <img className='absolute top-35.5 right-175 w-20 z-10' src={kirbyBite} />
    </div>
  );
}

export default Config;

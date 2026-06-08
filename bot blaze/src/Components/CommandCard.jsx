import { useEffect, useState } from 'react';

function CommandCard({ comando, tecla, delay, onDelete, onUpdate }) {
  const TECLAS = [
    'Up',
    'Down',
    'Left',
    'Right',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'Enter',
    'Space',
    'Tab',
    'LeftShift',
    'LeftControl',
    'F1',
    'F2',
    'F3',
    'F4',
    'F5',
    'F6',
    'F7',
    'F8',
    'F9',
    'F10',
    'F11',
    'F12',
    'Num0',
    'Num1',
    'Num2',
    'Num3',
    'Num4',
    'Num5',
    'Num6',
    'Num7',
    'Num8',
    'Num9',
    'mouse.click(Button.LEFT)',
    'mouse.click(Button.RIGHT)',
    'mouse.click(Button.MIDDLE)',
  ];

  const [local, setLocal] = useState({
    comando,
    tecla,
    delay,
  });

  useEffect(() => {
    setLocal({ comando, tecla, delay });
  }, [comando, tecla, delay]);

  function handleBlur() {
    onUpdate(comando, local);
  }

  return (
    <div className='card bg-[rgb(24,24,24)] w-44 border border-[rgb(255,20,255)]'>
      <div className='card-body items-center text-center gap-3'>
        {/* comando */}
        <div className='flex gap-2 items-center w-full justify-between'>
          <p className='text-white text-xs'>Comando: </p>
          <input
            className='input input-sm text-center w-full bg-[#1D232A] text-white focus:outline-none border border-[#464E58]'
            value={local.comando}
            onChange={(e) => setLocal({ ...local, comando: e.target.value.toLowerCase() })}
            onBlur={handleBlur}
          />
        </div>

        {/* delay */}
        <div className='flex gap-2 items-center w-full justify-between'>
          <p className='text-white text-xs'>Delay: </p>
          <input
            className='input input-sm text-center w-full bg-[#1D232A] text-white focus:outline-none border border-[#464E58]'
            type='number'
            min='0'
            value={local.delay}
            onChange={(e) => setLocal({ ...local, delay: Number(e.target.value) })}
            onBlur={handleBlur}
          />
        </div>

        {/* tecla */}
        <div className='flex gap-2 items-center w-full justify-between'>
          <p className='text-white text-xs'>Tecla: </p>
          <select
            className='select select-sm text-center bg-[#1D232A] text-white focus:outline-none border border-[#464E58]'
            value={local.tecla}
            onChange={(e) => setLocal({ ...local, tecla: e.target.value })}
            onBlur={handleBlur}>
            {TECLAS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* delete only */}
        <button className='btn btn-outline btn-error rounded-2xl mt-2' onClick={() => onDelete(comando)}>
          <span className='material-symbols-outlined'>delete</span>
        </button>
      </div>
    </div>
  );
}

export default CommandCard;

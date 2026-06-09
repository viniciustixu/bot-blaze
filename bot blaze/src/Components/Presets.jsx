function IconPresets({ number }) {
  return (
    <svg className='w-8 h-8 text-[rgb(255,20,255)]' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
      <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
      <g id='SVGRepo_iconCarrier'>
        {' '}
        <path
          d='M6.5 8.5L10.5 4.5H16C16.8284 4.5 17.5 5.17157 17.5 6V18C17.5 18.8284 16.8284 19.5 16 19.5H8C7.17157 19.5 6.5 18.8284 6.5 18V8.5Z'
          stroke='currentColor'></path>{' '}
        <path d='M11.5 7V10' stroke='currentColor' stroke-linecap='round'></path>{' '}
        <path d='M13.5 7V10' stroke='currentColor' stroke-linecap='round'></path>{' '}
        <path d='M15.5 7V10' stroke='currentColor' stroke-linecap='round'></path>{' '}
      </g>
      <text x='12' y='17' textAnchor='middle' fontSize='7' fill='white'>
        {number}
      </text>
    </svg>
  );
}

function AddPreset() {
  return (
    <button className='w-12 h-12 no-drag btn-success'>
      <svg className='w-8 h-8 text-green-400' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
        <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
        <g id='SVGRepo_iconCarrier'>
          {' '}
          <path
            d='M6.5 8.5L10.5 4.5H16C16.8284 4.5 17.5 5.17157 17.5 6V18C17.5 18.8284 16.8284 19.5 16 19.5H8C7.17157 19.5 6.5 18.8284 6.5 18V8.5Z'
            stroke='currentColor'></path>{' '}
          <path d='M11.5 7V10' stroke='currentColor' stroke-linecap='round'></path>{' '}
          <path d='M13.5 7V10' stroke='currentColor' stroke-linecap='round'></path>{' '}
          <path d='M15.5 7V10' stroke='currentColor' stroke-linecap='round'></path>{' '}
        </g>
        <text x='13' y='18' textAnchor='middle' fontSize='10' fill='rgb(74, 222, 128)'>
          +
        </text>
      </svg>
    </button>
  );
}

function Presets() {
  return (
    <div className='flex justify-center z-10'>
      <div className='border-2 border-[rgb(255,20,255)] rounded-2xl p-2 flex flex-col items-center w-fit z-10'>
        <div className='flex  justify-center items-center text-white '>
          <IconPresets number={1} />
          <IconPresets number={2} />
          <IconPresets number={3} />
          <IconPresets number={4} />
          <IconPresets number={5} />
          <IconPresets number={6} />
          <IconPresets number={7} />
          <AddPreset />
        </div>
        <div className='flex items-center gap-3 z-10'>
          <p className='text-white'>Nome do perfil X</p>
          <button className='btn btn-outline rounded-2xl btn-error w-6 h-6'>
            <span className='material-symbols-outlined'>delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Presets;

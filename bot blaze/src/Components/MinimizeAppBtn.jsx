function MinimizeIcon() {
  return (
    <svg
      viewBox='0 0 512 512'
      className='w-6 h-6'
      xmlns='http://www.w3.org/2000/svg'
      xmlns:xlink='http://www.w3.org/1999/xlink'
      aria-hidden='true'
      role='img'
      preserveAspectRatio='xMidYMid meet'
      fill='#000000'>
      <g id='SVGRepo_bgCarrier' stroke-width='0'></g>
      <g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g>
      <g id='SVGRepo_iconCarrier'>
        <path
          fill='currentColor'
          d='M471.695 411.923v47.823a6.913 6.913 0 0 1-6.913 6.913H47.217a6.913 6.913 0 0 1-6.913-6.913v-47.823a6.913 6.913 0 0 1 6.913-6.913h417.566a6.913 6.913 0 0 1 6.912 6.913z'></path>
      </g>
    </svg>
  );
}

function MinimizeAppBtn() {
  return (
    <button
      className='flex justify-center items-center w-8 h-8  text-white hover:text-[rgb(255,20,255)] no-drag mr-2 z-10'
      onClick={() => window.electronAPI.minimizarApp()}>
      <MinimizeIcon />
    </button>
  );
}

export default MinimizeAppBtn;

function TabSelector() {
  return (
    <div role='tablist' className='tabs tabs-border fixed top-5 left-5 font-bold text-xl z-10'>
      <a role='tab' className='tab tab-active text-white hover:text-[rgb(255,20,255)] z-10 no-drag'>
        INICIO
      </a>
      <a role='tab' className='tab text-white hover:text-[rgb(255,20,255)] z-10 no-drag'>
        CONTROLES
      </a>
      <a role='tab' className='tab text-white hover:text-[rgb(255,20,255)] z-10 no-drag'>
        CONFIGURAÇÕES
      </a>
    </div>
  );
}

export default TabSelector;

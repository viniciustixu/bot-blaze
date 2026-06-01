import { useNavigate, useLocation } from 'react-router-dom';

function TabSelector({ setErro }) {
  const navigate = useNavigate();
  const location = useLocation();

  async function navegar(path) {
    const status = await window.electronAPI.botRodando();

    if ((path === '/controles' || path === '/config') && (status === 'running' || status === 'starting')) {
      setErro('Desligue o bot antes de alterar controles ou configurações');
      return;
    }

    navigate(path);
  }

  return (
    <div role='tablist' className='tabs tabs-border fixed top-5 left-5 font-bold text-xl z-10'>
      <a
        role='tab'
        className={`tab no-drag z-10 ${
          location.pathname === '/' ? 'tab-active text-[rgb(255,20,255)]' : 'text-white hover:text-[rgb(255,20,255)]'
        }`}
        onClick={() => navegar('/')}>
        INICIO
      </a>

      <a
        role='tab'
        className={`tab no-drag z-10 ${
          location.pathname === '/controles'
            ? 'tab-active text-[rgb(255,20,255)]'
            : 'text-white hover:text-[rgb(255,20,255)]'
        }`}
        onClick={() => navegar('/controles')}>
        CONTROLES
      </a>

      <a
        role='tab'
        className={`tab no-drag z-10 ${
          location.pathname === '/config'
            ? 'tab-active text-[rgb(255,20,255)]'
            : 'text-white hover:text-[rgb(255,20,255)]'
        }`}
        onClick={() => navegar('/config')}>
        CONFIGURAÇÕES
      </a>
    </div>
  );
}

export default TabSelector;

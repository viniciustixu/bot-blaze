import { useNavigate, useLocation } from 'react-router-dom';

function TabSelector() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div role='tablist' className='tabs tabs-border fixed top-5 left-5 font-bold text-xl z-10'>
      <a
        role='tab'
        className={`tab no-drag z-10 ${
          location.pathname === '/' ? 'tab-active text-[rgb(255,20,255)]' : 'text-white hover:text-[rgb(255,20,255)]'
        }`}
        onClick={() => navigate('/')}>
        INICIO
      </a>

      <a
        role='tab'
        className={`tab no-drag z-10 ${
          location.pathname === '/controles'
            ? 'tab-active text-[rgb(255,20,255)]'
            : 'text-white hover:text-[rgb(255,20,255)]'
        }`}
        onClick={() => navigate('/controles')}>
        CONTROLES
      </a>

      <a
        role='tab'
        className={`tab no-drag z-10 ${
          location.pathname === '/config'
            ? 'tab-active text-[rgb(255,20,255)]'
            : 'text-white hover:text-[rgb(255,20,255)]'
        }`}
        onClick={() => navigate('/config')}>
        CONFIGURAÇÕES
      </a>
    </div>
  );
}

export default TabSelector;

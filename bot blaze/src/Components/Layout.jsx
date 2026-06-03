import { Outlet } from 'react-router-dom';
import DragBar from './DragBar';
import TabSelector from './TabSelector';
import BackgroundParticles from './BackgroundParticles';
import ErrorAlert from './ErrorAlert';
import { useState } from 'react';
import AppVersion from './AppVersion';

function Layout() {
  const [erro, setErro] = useState('');

  return (
    <div className='h-full'>
      <DragBar />
      <TabSelector setErro={setErro} />
      <BackgroundParticles />

      <Outlet context={{ setErro }} />

      <AppVersion />
      <ErrorAlert mensagem={erro} setErro={setErro} />
    </div>
  );
}

export default Layout;

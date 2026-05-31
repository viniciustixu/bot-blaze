import { Outlet } from 'react-router-dom';
import DragBar from './DragBar';
import TabSelector from './TabSelector';
import BackgroundParticles from './BackgroundParticles';
import ErrorAlert from './ErrorAlert';
import { useState } from 'react';

function Layout() {
  const [erro, setErro] = useState('');

  return (
    <div className='h-full'>
      <DragBar />
      <TabSelector />
      <BackgroundParticles />

      <Outlet context={{ setErro }} />

      <ErrorAlert mensagem={erro} setErro={setErro} />
    </div>
  );
}

export default Layout;

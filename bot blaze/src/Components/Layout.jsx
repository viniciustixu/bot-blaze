import { Outlet } from 'react-router-dom';
import DragBar from './DragBar';
import TabSelector from './TabSelector';
import BackgroundParticles from './BackgroundParticles';

function Layout() {
  return (
    <div className='h-full'>
      <DragBar />
      <TabSelector />
      <BackgroundParticles />

      <Outlet />
    </div>
  );
}

export default Layout;

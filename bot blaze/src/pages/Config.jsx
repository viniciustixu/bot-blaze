import { useRef } from 'react';
import ConfigGeral from '../pages/ConfigGeral';
import ConfigSorteio from '../pages/ConfigSorteio';
import ConfigChatBot from './ConfigChatBot';

const pages = [ConfigGeral, ConfigSorteio, ConfigChatBot];

function Config() {
  const containerRef = useRef(null);

  return (
    <div className='h-screen relative'>
      <div ref={containerRef} className='h-screen overflow-y-auto snap-y snap-mandatory scrollbar-hide'>
        {pages.map((Page, i) => (
          <div key={i} className='h-screen snap-start relative overflow-hidden'>
            <Page />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Config;

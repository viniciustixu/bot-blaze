import { useEffect, useState } from 'react';

function AppVersion() {
  const [version, setVersion] = useState('');

  useEffect(() => {
    window.electronAPI.appVersion().then(setVersion);
  }, []);

  return (
    <div className='fixed bottom-0 right-2 '>
      <p className='text-[rgb(36,36,36)]'>{version}</p>
    </div>
  );
}

export default AppVersion;

import { useEffect, useState } from 'react';
import PresetsModal from './PresetsModal';

function Presets({ onProfileChange }) {
  const [profiles, setProfiles] = useState([]);
  const [active, setActive] = useState('default');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState('');

  async function carregar() {
    const data = await window.electronAPI.getPresets();
    setProfiles(data.profiles);
    setActive(data.active);
  }

  useEffect(() => {
    carregar();
  }, []);

  async function handleSwitch(name) {
    if (name === active) return;
    const res = await window.electronAPI.switchPreset(name);
    if (res.erro) return;
    setActive(name);
    onProfileChange?.();
  }

  async function handleDelete(name) {
    const res = await window.electronAPI.deletePreset(name);
    if (res.erro) return;
    if (name === active) {
      const data = await window.electronAPI.getPresets();
      setActive(data.active);
    }
    onProfileChange?.();
    carregar();
  }

  async function handleCreate(name) {
    setModalError('');
    const res = await window.electronAPI.createPreset(name);
    if (res.erro) {
      setModalError(res.erro);
      return;
    }
    setModalOpen(false);
    onProfileChange?.();
    carregar();
  }

  return (
    <>
      <div className='flex justify-center z-10 mb-6'>
        <div className='border-2 border-[rgb(255,20,255)] rounded-2xl p-2 flex flex-col items-center w-fit z-10'>
          <div className='flex justify-center items-center text-white gap-1'>
            {profiles.map((name, i) => (
              <div key={name} className='tooltip tooltip-bottom tooltip-purple' data-tip={name}>
                <button
                  className='w-12 h-12 no-drag rounded-lg flex flex-col items-center justify-center group'
                  onClick={() => handleSwitch(name)}>
                  <IconPresets number={i + 1} active={name === active} />
                </button>
              </div>
            ))}
            {profiles.length < 9 && (
              <button
                className='w-12 h-12 no-drag rounded-lg flex items-center justify-center border border-transparent hover:border-green-500 hover:bg-green-500/20 transition-all'
                onClick={() => setModalOpen(true)}>
                <svg className='w-8 h-8 text-green-400' viewBox='0 0 24 24' fill='none'>
                  <path
                    d='M6.5 8.5L10.5 4.5H16C16.8284 4.5 17.5 5.17157 17.5 6V18C17.5 18.8284 16.8284 19.5 16 19.5H8C7.17157 19.5 6.5 18.8284 6.5 18V8.5Z'
                    stroke='currentColor'
                  />
                  <path d='M11.5 7V10' stroke='currentColor' strokeLinecap='round' />
                  <path d='M13.5 7V10' stroke='currentColor' strokeLinecap='round' />
                  <path d='M15.5 7V10' stroke='currentColor' strokeLinecap='round' />
                  <text x='13' y='18' textAnchor='middle' fontSize='10' fill='currentColor'>
                    +
                  </text>
                </svg>
              </button>
            )}
          </div>

          {profiles.length > 0 && (
            <div className='flex items-center gap-3 mt-2'>
              <p className='text-white text-sm font-bold'>{active}</p>
              {profiles.length > 1 && (
                <button className='btn btn-outline btn-error btn-xs rounded-2xl' onClick={() => handleDelete(active)}>
                  <span className='material-symbols-outlined text-sm'>delete</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <PresetsModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setModalError('');
        }}
        onConfirm={handleCreate}
        error={modalError}
      />
    </>
  );
}

function IconPresets({ number, active }) {
  return (
    <svg
      className={`w-8 h-8 ${active ? 'text-[rgb(255,20,255)]' : 'text-gray-400 group-hover:text-[rgb(255,20,255)]'}`}
      viewBox='0 0 24 24'
      fill='none'>
      <path
        d='M6.5 8.5L10.5 4.5H16C16.8284 4.5 17.5 5.17157 17.5 6V18C17.5 18.8284 16.8284 19.5 16 19.5H8C7.17157 19.5 6.5 18.8284 6.5 18V8.5Z'
        stroke='currentColor'
      />
      <path d='M11.5 7V10' stroke='currentColor' strokeLinecap='round' />
      <path d='M13.5 7V10' stroke='currentColor' strokeLinecap='round' />
      <path d='M15.5 7V10' stroke='currentColor' strokeLinecap='round' />
      <text x='12' y='17' textAnchor='middle' fontSize='7' fill={active ? 'white' : '#9CA3AF'}>
        {number}
      </text>
    </svg>
  );
}

export default Presets;

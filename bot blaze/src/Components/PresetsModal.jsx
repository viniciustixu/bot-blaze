import { useState } from 'react';

function PresetsModal({ isOpen, onClose, onConfirm, error }) {
  const [name, setName] = useState('');

  if (!isOpen) return null;

  function handleSubmit(e) {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name.trim());
      setName('');
    }
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='bg-[rgb(24,24,24)] border-2 border-[rgb(255,20,255)] rounded-2xl p-6 w-80 shadow-lg'>
        <h2 className='text-white text-lg font-bold mb-4 text-center'>Novo Perfil</h2>
        <form onSubmit={handleSubmit}>
          <input
            className='input w-full bg-[#1D232A] text-white border border-[#464E58] focus:outline-none mb-3'
            placeholder='Nome do perfil'
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={20}
          />
          {error && <p className='text-red-400 text-sm mb-3 text-center'>{error}</p>}
          <div className='flex gap-3 justify-center'>
            <button type='submit' className='btn btn-success btn-sm rounded-2xl'>
              Criar
            </button>
            <button
              type='button'
              className='btn btn-outline btn-sm btn-error rounded-2xl'
              onClick={() => {
                setName('');
                onClose();
              }}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PresetsModal;

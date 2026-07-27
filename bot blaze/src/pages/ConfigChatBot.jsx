import { useEffect, useRef, useState, useCallback } from 'react';
import OkAlert from '../Components/OkAlert';

function ConfigChatBot() {
  const cardRef = useRef(null);
  const scrollRef = useRef(null);
  const [showAlert, setShowAlert] = useState(false);
  const [commands, setCommands] = useState({});
  const [adding, setAdding] = useState(false);
  const [newKey, setNewKey] = useState('');
  const [newResposta, setNewResposta] = useState('');
  const [editingKey, setEditingKey] = useState(null);
  const [editKey, setEditKey] = useState('');
  const [editResposta, setEditResposta] = useState('');

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    scrollRef.current.scrollTop += e.deltaY;
  }, []);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  async function carregar() {
    const dados = await window.electronAPI.getChatCommands();
    setCommands(dados || {});
  }

  useEffect(() => {
    carregar();
  }, []);

  async function criar() {
    if (!newKey.trim() || !newResposta.trim()) return;
    const key = newKey.trim().startsWith('!') ? newKey.trim() : '!' + newKey.trim();
    const result = await window.electronAPI.createChatCommand({ comando: key, resposta: newResposta.trim() });
    if (result.erro) return alert(result.erro);
    setNewKey('');
    setNewResposta('');
    setAdding(false);
    await carregar();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }

  async function deletar(key) {
    await window.electronAPI.deleteChatCommand(key);
    await carregar();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }

  function iniciarEdicao(key, resposta) {
    setEditingKey(key);
    setEditKey(key);
    setEditResposta(resposta);
  }

  async function salvarEdicao() {
    if (!editKey.trim() || !editResposta.trim()) return;
    const newKeyFormatted = editKey.trim().startsWith('!') ? editKey.trim() : '!' + editKey.trim();
    await window.electronAPI.updateChatCommand(editingKey, { comando: newKeyFormatted, resposta: editResposta.trim() });
    setEditingKey(null);
    await carregar();
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  }

  const commandEntries = Object.entries(commands);

  return (
    <div className='flex justify-center h-screen'>
      <div className='flex flex-col'>
        <h1 className='text-5xl font-bold text-[rgb(255,20,255)] drop-shadow-lg text-center mt-6'>COMANDOS DO CHAT</h1>

        <div
          ref={cardRef}
          className='flex flex-col p-5 text-white gap-4 rounded-2xl mt-6 z-10 border-2 border-[rgb(255,20,255)] min-w-[550px] h-[60vh]'>

          <div ref={scrollRef} className='flex flex-col gap-2 overflow-y-auto pr-1 flex-1'>
            {commandEntries.length === 0 && (
              <p className='text-gray-400 text-center'>Nenhum comando cadastrado.</p>
            )}

            {commandEntries.map(([key, cmd]) => (
              <div key={key} className='flex flex-col gap-2 p-3 border border-[#464E58] rounded-lg'>
                {editingKey === key ? (
                  <>
                    <div className='flex gap-2 items-center'>
                      <label className='text-[rgb(255,20,255)] w-24'>Comando:</label>
                      <input
                        className='input text-black w-48 bg-white focus:outline-none border border-[#464E58]'
                        value={editKey}
                        onChange={(e) => setEditKey(e.target.value)}
                      />
                    </div>
                    <div className='flex gap-2 items-center'>
                      <label className='text-[rgb(255,20,255)] w-24'>Resposta:</label>
                      <input
                        className='input text-black flex-1 bg-white focus:outline-none border border-[#464E58]'
                        value={editResposta}
                        onChange={(e) => setEditResposta(e.target.value)}
                      />
                    </div>
                    <div className='flex gap-2 self-end'>
                      <button className='btn btn-outline btn-sm rounded-2xl' onClick={() => setEditingKey(null)}>
                        <span className='material-symbols-outlined'>close</span>
                      </button>
                      <button className='btn btn-outline btn-success btn-sm rounded-2xl' onClick={salvarEdicao}>
                        <span className='material-symbols-outlined'>check</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className='flex gap-2 items-center'>
                    <span className='text-[rgb(255,20,255)] font-bold w-40 truncate'>{key}</span>
                    <span className='text-gray-300 flex-1 truncate'>{cmd.resposta}</span>
                    <div className='flex gap-2'>
                      <button
                        className='btn btn-outline btn-warning btn-sm rounded-2xl'
                        onClick={() => iniciarEdicao(key, cmd.resposta)}>
                        <span className='material-symbols-outlined'>edit</span>
                      </button>
                      <button
                        className='btn btn-outline btn-error btn-sm rounded-2xl'
                        onClick={() => deletar(key)}>
                        <span className='material-symbols-outlined'>delete</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {adding && (
            <div className='flex flex-col gap-2 p-3 border border-[rgb(255,20,255)] rounded-lg'>
              <div className='flex gap-2 items-center'>
                <label className='text-[rgb(255,20,255)] w-24'>Comando:</label>
                <input
                  className='input text-black w-48 bg-white focus:outline-none border border-[#464E58]'
                  placeholder='!howtoplay'
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                />
              </div>
              <div className='flex gap-2 items-center'>
                <label className='text-[rgb(255,20,255)] w-24'>Resposta:</label>
                <input
                  className='input text-black flex-1 bg-white focus:outline-none border border-[#464E58]'
                  placeholder='Use cima, baixo, esquerda, direita...'
                  value={newResposta}
                  onChange={(e) => setNewResposta(e.target.value)}
                />
              </div>
              <button className='btn btn-outline btn-success self-end' onClick={criar}>Criar</button>
            </div>
          )}

          <button
            className='btn btn-outline btn-success flex-shrink-0'
            onClick={() => setAdding(!adding)}>
            {adding ? 'Cancelar' : 'Adicionar Comando'}
          </button>

          {showAlert && <OkAlert />}
        </div>
      </div>
    </div>
  );
}

export default ConfigChatBot;

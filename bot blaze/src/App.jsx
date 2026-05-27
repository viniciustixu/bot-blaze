import { useState } from 'react';

function App() {
  function iniciarBot() {
    window.electronAPI.iniciarBot();
  }

  return (
    <>
      <h1>Bot Blaze mt foda</h1>

      <button onClick={iniciarBot}>Iniciar Bot</button>
    </>
  );
}

export default App;

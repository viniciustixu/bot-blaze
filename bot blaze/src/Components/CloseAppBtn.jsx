function CloseAppBtn() {
  return (
    <button className='btn btn-circle btn-error no-drag mr-4' onClick={() => window.electronAPI.fecharApp()}>
      ✕
    </button>
  );
}

export default CloseAppBtn;

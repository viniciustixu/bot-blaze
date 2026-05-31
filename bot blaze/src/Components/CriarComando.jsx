function CriarComando({ criarComando }) {
  return (
    <button className='btn btn-circle btn-success z-10 no-drag fixed right-5 bottom-5' onClick={criarComando}>
      <span class='material-symbols-outlined'>add</span>
    </button>
  );
}

export default CriarComando;

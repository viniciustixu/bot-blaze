function ChatDisplay({ fila, executando }) {
  const itensVisiveis = fila.slice(0, 6);
  const restantes = fila.length - 6;

  return (
    <div className='chat chat-end mt-10 px-10 bg-[rgb(24,24,24)] rounded-2xl w-[400px] h-[450px] z-10'>
      <div className='flex flex-col gap-2 mt-5'>
        {itensVisiveis.map((item) => {
          const ativo = executando?.uuid === item.uuid;

          return (
            <div className='flex items-end justify-end mr-5'>
              <div
                key={item.uuid}
                className={`font-atkinson flex w-fit chat-bubble whitespace-nowrap rounded-2xl rounded-br-none px-10 text-2xl ${
                  ativo ? 'bg-orange-500 text-white' : ''
                }`}>
                {item.usuario.toUpperCase() + ': ' + item.mensagem.toUpperCase().slice(1)}
              </div>
            </div>
          );
        })}

        {restantes > 0 && (
          <div className='flex items-end justify-end mr-5'>
            <div className='chat-bubble chat-bubble-success text-base-content rounded-2xl rounded-br-none'>
              +{restantes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatDisplay;

function ChatDisplay({ fila }) {
  return (
    <div className='chat chat-end mt-10 px-10 bg-[rgb(24,24,24)] rounded-2xl w-[400px] h-[450px] z-10'>
      <div className='flex flex-col gap-2 mt-5'>
        {fila.map((item) => (
          <div
            key={item.uuid}
            className='flex w-fit chat-bubble whitespace-nowrap rounded-2xl rounded-br-none px-10 text-2xl'>
            {item.usuario + ': ' + item.mensagem.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatDisplay;

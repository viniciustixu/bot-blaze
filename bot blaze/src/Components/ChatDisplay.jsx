import { motion, AnimatePresence } from 'framer-motion';

function ChatDisplay({ fila, executando }) {
  let itensVisiveis = fila.slice(0, 6);

  if (executando && !itensVisiveis.some((item) => item.uuid === executando.uuid)) {
    itensVisiveis = [executando, ...itensVisiveis.slice(0, 5)];
  }

  const restantes = fila.length - itensVisiveis.length;

  return (
    <div className='chat chat-end mt-10 px-10 bg-[rgb(24,24,24)] rounded-2xl w-[400px] h-[450px] z-10'>
      <div className='flex flex-col gap-2 mt-5 items-end w-full'>
        <AnimatePresence mode='popLayout'>
          {itensVisiveis.map((item) => {
            const ativo = executando?.uuid === item.uuid;

            return (
              <motion.div
                key={item.uuid}
                layout='position'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className='flex items-end justify-end w-fit'>
                <div
                  className={`flex  font-atkinsonb chat-bubble whitespace-nowrap rounded-2xl rounded-br-none mr-5 text-2xl ${
                    ativo ? 'bg-orange-500 text-white' : 'bg-white text-black'
                  }`}>
                  {item.usuario.slice(0, 8).toUpperCase() + '➜' + item.mensagem.slice(0, 9).toUpperCase()}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {restantes > 0 && (
          <motion.div layout='position' className='flex items-end justify-end mr-5'>
            <div className='chat-bubble chat-bubble-success rounded-2xl rounded-br-none'>+{restantes}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ChatDisplay;

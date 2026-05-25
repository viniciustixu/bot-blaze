const {
  startChatReader
} = require('./chatreader');

const { executarFila } =
  require('./execute');

startChatReader();

executarFila();
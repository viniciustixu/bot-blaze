const {
  startChatReader
} = require('./chatreader');

const startExecutor =
  require('./execute');

startChatReader();

startExecutor();
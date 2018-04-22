/* importar as configurações do servidor */
var app = require('../src/config/server');

//porta de conexão
const port = 3003;

//ouvindo o servidor
app.listen(port, function() {
  console.log(`Wofboot is running on port ${port}`);
});

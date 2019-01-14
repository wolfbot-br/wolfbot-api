/* importar as configurações do servidor */
var app = require('../src/config/server')

// porta de conexão
const port = 8081

// ouvindo o servidor
app.listen(process.env.PORT || port, function () {
  console.log(`Wofboot API - Executando na porta ${port}`)
})

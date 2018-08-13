const configuracao = require('../../infraestrutura/mongo/models/configuracao.model')

const stop = (play, params) => {
  clearInterval(play)
  configuracao.update(
    { 'usuario.id_usuario': params.id_usuario, 'exchange.id_exchange': params.id_exchange },
    { $set: { status: 'offline' } },
    function (err, query) {
      if (err) {
        res.status(400).json({
          'message': err,
          'status': 400
        })
      } else {
        console.log('Configuração alterado com sucesso.')
      }
    })
}

const play = (params) => {
  configuracao.update(
    { 'usuario.id_usuario': params.id_usuario, 'exchange.id_exchange': params.id_exchange },
    { $set: { status: 'online' } },
    function (err, query) {
      if (err) {
        res.status(400).json({
          'message': err,
          'status': 400
        })
      } else {
        console.log('Configuração alterado com sucesso.')
      }
    })
}

module.exports = {
  stop,
  play
}

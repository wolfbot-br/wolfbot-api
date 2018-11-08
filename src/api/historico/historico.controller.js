const env = require('../../../.env')
const jwt = require('jsonwebtoken')

const historicoService = require('../historico/historico.service')

const historicos = (req, res, next) => {
  historicoService.historicos(res, req.user)
}

module.exports =
  {
    historicos
  }
